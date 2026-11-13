import type { INodeProperties } from 'n8n-workflow';
import { operation, query, simplify, vinField } from '../shared/descriptions';

const resource = ['vin'];
const vin = '{{ toPathSegment($parameter.vin) }}';

export const vinDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource } },
		options: [
			operation(
				'Decode',
				'decode',
				'Decode a VIN',
				'Get the year, make, model, trim, engine and more for a VIN',
				`=/vin/${vin}`,
			),
			operation(
				'Get Build Data',
				'getBuild',
				'Get build data for a VIN',
				'Get the factory build of a vehicle: exact trim, colors, options and packages',
				`=/build/${vin}`,
				'build',
			),
			operation(
				'Get Open Recalls',
				'getOpenRecalls',
				'Get open recalls for a VIN',
				'Get only the recalls that have not been repaired on this vehicle',
				`=/openrecalls/${vin}`,
			),
			operation(
				'Get Recalls',
				'getRecalls',
				'Get recalls for a VIN',
				'Get every safety recall issued for this vehicle',
				`=/recalls/${vin}`,
				'data',
			),
			operation(
				'Get Specifications',
				'getSpecs',
				'Get specifications for a VIN',
				'Get engine, measurements, features, colors and options for a vehicle',
				`=/specs/${vin}`,
			),
		],
		default: 'decode',
	},
	vinField({ resource }),
	simplify(
		{ resource, operation: ['decode'] },
		{
			vin: '={{$responseItem.vin}}',
			year: '={{$responseItem.vehicle?.year}}',
			make: '={{$responseItem.make}}',
			model: '={{$responseItem.model}}',
			trim: '={{$responseItem.trim}}',
			body: '={{$responseItem.body}}',
			engine: '={{$responseItem.engine}}',
			drive: '={{$responseItem.drive}}',
			transmission: '={{$responseItem.transmission}}',
			fuel: '={{$responseItem.fuel}}',
		},
	),
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		displayOptions: { show: { resource, operation: ['decode', 'getSpecs'] } },
		options: [
			{
				displayName: 'Allow Best Guess',
				name: 'ambiguity',
				type: 'boolean',
				default: false,
				description:
					'Whether to return a best guess when a VIN matches several trims. When off, trim and style are empty for those VINs and the candidates are listed.',
				routing: query('ambiguity'),
			},
		],
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		displayOptions: { show: { resource, operation: ['getBuild'] } },
		options: [
			{
				displayName: 'Include Standard Equipment',
				name: 'includeStandard',
				type: 'boolean',
				default: false,
				description: 'Whether to add the equipment the vehicle ships with as standard',
				routing: query('includeStandard'),
			},
		],
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		displayOptions: { show: { resource, operation: ['getOpenRecalls'] } },
		options: [
			{
				displayName: 'Include Recall Catalog',
				name: 'recalls',
				type: 'boolean',
				default: false,
				description:
					'Whether to add every recall for the make, model and year, including repaired ones',
				routing: query('recalls'),
			},
		],
	},
];
