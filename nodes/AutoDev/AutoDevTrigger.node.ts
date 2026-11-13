import {
	NodeApiError,
	NodeConnectionTypes,
	type IDataObject,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type IPollFunctions,
	type JsonObject,
} from 'n8n-workflow';
import { LISTING_FILTER_QUERY, listingFilters } from './shared/descriptions';
import { describeError } from './shared/errors';

/** How many VINs the trigger remembers, so a listing is only ever emitted once. */
const REMEMBERED = 1000;

interface Listing extends IDataObject {
	vin?: string;
}

/**
 * Programmatic because a declarative node cannot poll. Each poll is one request to /listings,
 * newest first; listings whose VIN was not in an earlier poll are emitted.
 */
export class AutoDevTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Auto.dev Trigger',
		name: 'autoDevTrigger',
		icon: { light: 'file:../../icons/autodev.svg', dark: 'file:../../icons/autodev.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: 'New listing',
		description: 'Starts the workflow when a new vehicle listing matches your search',
		defaults: {
			name: 'Auto.dev Trigger',
		},
		polling: true,
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'autoDevApi',
				required: true,
			},
		],
		properties: [
			{
				displayName:
					'Each poll is one request to the Auto.dev listings API and counts toward your plan. Choose a poll time that fits how often you need new listings.',
				name: 'notice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'New Listing',
						value: 'newListing',
						description: 'A vehicle listing that matches your filters appears for the first time',
					},
				],
				default: 'newListing',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add filter',
				default: {},
				options: listingFilters(false),
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 50,
				description: 'Max number of results to return',
			},
		],
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const filters = this.getNodeParameter('filters', {}) as IDataObject;
		const limit = this.getNodeParameter('limit', 50) as number;

		const qs: IDataObject = { sort: 'createdAt.desc', limit };
		for (const [name, value] of Object.entries(filters)) {
			if (value !== '' && value !== undefined && LISTING_FILTER_QUERY[name]) {
				qs[LISTING_FILTER_QUERY[name]] = value;
			}
		}

		const response = await this.helpers.httpRequestWithAuthentication.call(this, 'autoDevApi', {
			method: 'GET',
			url: 'https://api.auto.dev/listings',
			qs,
			json: true,
			returnFullResponse: true,
			ignoreHttpStatusErrors: true,
		});
		if (response.statusCode >= 400) {
			throw new NodeApiError(
				this.getNode(),
				(response.body ?? {}) as JsonObject,
				describeError(response.statusCode, response.body),
			);
		}

		const listings = ((response.body as { data?: Listing[] })?.data ?? []).filter(
			(listing) => typeof listing.vin === 'string',
		);

		// A manual test shows what the search returns without changing what the trigger remembers.
		if (this.getMode() === 'manual') {
			return listings.length ? [this.helpers.returnJsonArray(listings)] : null;
		}

		const staticData = this.getWorkflowStaticData('node');
		const firstPoll = !Array.isArray(staticData.seenVins);
		const seen = new Set((staticData.seenVins as string[] | undefined) ?? []);
		const fresh = listings.filter((listing) => !seen.has(listing.vin as string));

		staticData.seenVins = [...fresh.map((listing) => listing.vin as string), ...seen].slice(
			0,
			REMEMBERED,
		);

		// The first poll only records what is already listed, so the workflow starts with new listings.
		if (firstPoll || fresh.length === 0) return null;
		return [this.helpers.returnJsonArray(fresh)];
	}
}
