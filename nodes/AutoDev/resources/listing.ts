import type { INodeProperties } from 'n8n-workflow';
import {
	listingFilters,
	operation,
	query,
	simplify,
	SIMPLE_LISTING,
	vinField,
} from '../shared/descriptions';

const resource = ['listing'];
const vin = '{{ toPathSegment($parameter.vin) }}';
const getMany = { resource, operation: ['getAll'] };

export const listingDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource } },
		options: [
			operation(
				'Get',
				'get',
				'Get a listing by VIN',
				'Get the dealer listing for one vehicle: price, mileage, dealer and history',
				`=/listings/${vin}`,
				'data',
			),
			operation(
				'Get Many',
				'getAll',
				'Get many listings',
				'Search new and used vehicle listings from US dealers',
				'/listings',
				'data',
			),
			operation(
				'Get Photos',
				'getPhotos',
				'Get photos for a VIN',
				'Get the retail photos of a vehicle',
				`=/photos/${vin}`,
				'data',
			),
		],
		default: 'getAll',
	},
	vinField({ resource, operation: ['get', 'getPhotos'] }),
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 50,
		description: 'Max number of results to return',
		displayOptions: { show: getMany },
		routing: {
			send: { type: 'query', property: 'limit' },
			output: { maxResults: '={{$value}}' },
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add filter',
		default: {},
		displayOptions: { show: getMany },
		options: listingFilters(true),
	},
	simplify({ resource, operation: ['get', 'getAll'] }, SIMPLE_LISTING),
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		displayOptions: { show: getMany },
		options: [
			{
				displayName: 'Include Unpriced',
				name: 'includeUnpriced',
				type: 'boolean',
				default: false,
				description: 'Whether to include listings that have no price',
				routing: query('includeUnpriced'),
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 1,
				description: 'Which page of results to return, starting from 1',
				routing: query('page'),
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'options',
				options: [
					{ name: 'Mileage, Highest First', value: 'miles.desc' },
					{ name: 'Mileage, Lowest First', value: 'miles.asc' },
					{ name: 'Newest Listing First', value: 'createdAt.desc' },
					{ name: 'Oldest Listing First', value: 'createdAt.asc' },
					{ name: 'Price, Highest First', value: 'price.desc' },
					{ name: 'Price, Lowest First', value: 'price.asc' },
					{ name: 'Recently Updated First', value: 'updatedAt.desc' },
					{ name: 'Year, Newest First', value: 'year.desc' },
					{ name: 'Year, Oldest First', value: 'year.asc' },
				],
				default: 'updatedAt.desc',
				description: 'The order to return listings in',
				routing: query('sort'),
			},
		],
	},
];
