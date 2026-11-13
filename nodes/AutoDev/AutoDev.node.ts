import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { financeDescription } from './resources/finance';
import { listingDescription } from './resources/listing';
import { plateDescription } from './resources/plate';
import { vinDescription } from './resources/vin';

export class AutoDev implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Auto.dev',
		name: 'autoDev',
		icon: { light: 'file:../../icons/autodev.svg', dark: 'file:../../icons/autodev.dark.svg' },
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Decode VINs, search dealer listings and get vehicle data from the Auto.dev API',
		defaults: {
			name: 'Auto.dev',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'autoDevApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.auto.dev',
			headers: {
				Accept: 'application/json',
			},
			ignoreHttpStatusErrors: true,
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Finance',
						value: 'finance',
					},
					{
						name: 'Listing',
						value: 'listing',
					},
					{
						name: 'Plate',
						value: 'plate',
					},
					{
						name: 'VIN',
						value: 'vin',
					},
				],
				default: 'vin',
			},
			...vinDescription,
			...listingDescription,
			...plateDescription,
			...financeDescription,
		],
	};
}
