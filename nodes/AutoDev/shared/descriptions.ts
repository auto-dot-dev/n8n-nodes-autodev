import type { INodeProperties, INodePropertyOptions, INodePropertyRouting } from 'n8n-workflow';
import { handleErrors } from './errors';

type Show = { resource: string[]; operation?: string[] };

/** One operation in a resource's Operation list: a GET to `url`, with errors explained. */
export function operation(
	name: string,
	value: string,
	action: string,
	description: string,
	url: string,
	rootProperty?: string,
): INodePropertyOptions {
	const routing: INodePropertyRouting = {
		request: { method: 'GET', url },
		output: {
			postReceive: [
				handleErrors,
				...(rootProperty
					? [{ type: 'rootProperty' as const, properties: { property: rootProperty } }]
					: []),
			],
		},
	};
	return { name, value, action, description, routing };
}

export function vinField(show: Show): INodeProperties {
	return {
		displayName: 'VIN',
		name: 'vin',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 1HGCM82633A004352',
		description: 'The 17-character Vehicle Identification Number',
		displayOptions: { show },
	};
}

export const query = (name: string): INodePropertyRouting => ({
	request: { qs: { [name]: '={{$value}}' } },
});

/** Every listing filter, with the query parameter it is sent as. */
const FILTERS: Array<INodeProperties & { query: string }> = [
	{
		displayName: 'Body Style',
		name: 'bodyStyle',
		type: 'string',
		default: '',
		placeholder: 'e.g. sedan,coupe',
		description: 'Body style. Separate several with commas.',
		query: 'vehicle.bodyStyle',
	},
	{
		displayName: 'Certified Pre-Owned',
		name: 'cpo',
		type: 'boolean',
		default: true,
		description: 'Whether to return only certified pre-owned listings',
		query: 'retailListing.cpo',
	},
	{
		displayName: 'Condition',
		name: 'used',
		type: 'options',
		options: [
			{ name: 'New', value: 'false' },
			{ name: 'Used', value: 'true' },
		],
		default: 'true',
		description: 'Whether to return new or used vehicles',
		query: 'retailListing.used',
	},
	{
		displayName: 'Dealer ID',
		name: 'dealerId',
		type: 'string',
		default: '',
		description:
			'Return one dealer\'s inventory. Use the dealer ID a listing returns in "retailListing.dealerId". Separate several with commas.',
		query: 'dealerId',
	},
	{
		displayName: 'Distance',
		name: 'distance',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 50,
		description: 'Radius in miles around the ZIP code. Use together with ZIP Code.',
		query: 'distance',
	},
	{
		displayName: 'Fuel',
		name: 'fuel',
		type: 'string',
		default: '',
		placeholder: 'e.g. Hybrid,Electric',
		description:
			'Fuel type: Gasoline, Hybrid, Electric, Plug-In Hybrid or Diesel. Separate several with commas.',
		query: 'vehicle.fuel',
	},
	{
		displayName: 'Make',
		name: 'make',
		type: 'string',
		default: '',
		placeholder: 'e.g. Ford,Chevrolet',
		description: 'Vehicle manufacturer. Separate several with commas.',
		query: 'vehicle.make',
	},
	{
		displayName: 'Mileage',
		name: 'miles',
		type: 'string',
		default: '',
		placeholder: 'e.g. 10000-40000',
		description: 'Mileage as a range',
		query: 'retailListing.miles',
	},
	{
		displayName: 'Model',
		name: 'model',
		type: 'string',
		default: '',
		placeholder: 'e.g. F-150,Silverado',
		description: 'Vehicle model. Separate several with commas.',
		query: 'vehicle.model',
	},
	{
		displayName: 'Price',
		name: 'price',
		type: 'string',
		default: '',
		placeholder: 'e.g. 10000-20000',
		description: 'Price in US dollars as a range',
		query: 'retailListing.price',
	},
	{
		displayName: 'State',
		name: 'state',
		type: 'string',
		default: '',
		placeholder: 'e.g. CA',
		description: 'Two-letter code of the state the vehicle is in',
		query: 'retailListing.state',
	},
	{
		displayName: 'Transmission',
		name: 'transmission',
		type: 'string',
		default: '',
		placeholder: 'e.g. automatic',
		description: 'Transmission type. Separate several with commas.',
		query: 'vehicle.transmission',
	},
	{
		displayName: 'Trim',
		name: 'trim',
		type: 'string',
		default: '',
		placeholder: 'e.g. XLT,LT',
		description: 'Trim level. Separate several with commas.',
		query: 'vehicle.trim',
	},
	{
		displayName: 'Year',
		name: 'year',
		type: 'string',
		default: '',
		placeholder: 'e.g. 2018-2020',
		description: 'Model year, as one year or a range',
		query: 'vehicle.year',
	},
	{
		displayName: 'ZIP Code',
		name: 'zip',
		type: 'string',
		default: '',
		placeholder: 'e.g. 33132',
		description: 'Five-digit ZIP code to search around. Use together with Distance.',
		query: 'zip',
	},
];

/** The listing filters, shared by the Listing resource and the trigger. `route` is off for the trigger, which builds its own request. */
export function listingFilters(route: boolean): INodeProperties[] {
	return FILTERS.map(({ query: name, ...property }) =>
		route ? { ...property, routing: query(name) } : property,
	);
}

/** Which query parameter each filter is sent as. Used by the trigger. */
export const LISTING_FILTER_QUERY: Record<string, string> = Object.fromEntries(
	FILTERS.map((filter) => [filter.name, filter.query]),
);

/** The ten fields a simplified listing keeps. */
export const SIMPLE_LISTING = {
	vin: '={{$responseItem.vin}}',
	year: '={{$responseItem.vehicle?.year}}',
	make: '={{$responseItem.vehicle?.make}}',
	model: '={{$responseItem.vehicle?.model}}',
	trim: '={{$responseItem.vehicle?.trim}}',
	price: '={{$responseItem.retailListing?.price}}',
	miles: '={{$responseItem.retailListing?.miles}}',
	dealer: '={{$responseItem.retailListing?.dealer}}',
	state: '={{$responseItem.retailListing?.state}}',
	url: '={{$responseItem.retailListing?.vdp}}',
};

export function simplify(show: Show, properties: Record<string, string>): INodeProperties {
	return {
		displayName: 'Simplify',
		name: 'simplify',
		type: 'boolean',
		default: true,
		description: 'Whether to return a simplified version of the response instead of the raw data',
		displayOptions: { show },
		routing: {
			output: {
				postReceive: [{ type: 'setKeyValue', enabled: '={{$value}}', properties }],
			},
		},
	};
}
