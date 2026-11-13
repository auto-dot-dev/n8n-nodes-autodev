import type { INodeProperties } from 'n8n-workflow';
import { operation } from '../shared/descriptions';

const resource = ['plate'];

export const plateDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource } },
		options: [
			operation(
				'Get VIN',
				'getVin',
				'Get the VIN for a license plate',
				'Look up the VIN, year, make and model behind a US license plate',
				'=/plate/{{ toPathSegment($parameter.state) }}/{{ toPathSegment($parameter.plate) }}',
			),
		],
		default: 'getVin',
	},
	{
		displayName: 'State',
		name: 'state',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. CA',
		description: 'Two-letter code of the state the plate is registered in',
		displayOptions: { show: { resource } },
	},
	{
		displayName: 'License Plate',
		name: 'plate',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 7ABC123',
		description: 'The plate number, 2 to 8 letters and digits',
		displayOptions: { show: { resource } },
	},
];
