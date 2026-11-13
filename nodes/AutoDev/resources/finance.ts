import type { INodeProperties } from 'n8n-workflow';
import { operation, query, vinField } from '../shared/descriptions';

const resource = ['finance'];
const vin = '{{ toPathSegment($parameter.vin) }}';

const zip = (description: string): INodeProperties => ({
	displayName: 'ZIP Code',
	name: 'zip',
	type: 'string',
	default: '',
	placeholder: 'e.g. 33132',
	description,
	routing: query('zip'),
});

const money = (displayName: string, name: string, description: string): INodeProperties => ({
	displayName,
	name,
	type: 'number',
	typeOptions: { minValue: 0, numberPrecision: 2 },
	default: 0,
	description,
	routing: query(name),
});

const creditScore: INodeProperties = {
	displayName: 'Credit Score',
	name: 'creditScore',
	type: 'string',
	default: '',
	placeholder: 'e.g. 720',
	description: "The borrower's credit score, used to quote the interest rate",
	routing: query('creditScore'),
};

const options = (operations: string[], fields: INodeProperties[]): INodeProperties => ({
	displayName: 'Options',
	name: 'options',
	type: 'collection',
	placeholder: 'Add option',
	default: {},
	displayOptions: { show: { resource, operation: operations } },
	options: fields,
});

export const financeDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource } },
		options: [
			operation(
				'Get Interest Rates',
				'getInterestRates',
				'Get interest rates for a VIN',
				'Get current used-auto loan rates for 36 to 84 month terms',
				`=/apr/${vin}`,
			),
			operation(
				'Get Ownership Cost',
				'getOwnershipCost',
				'Get the cost of ownership for a VIN',
				'Get the five-year cost to own a vehicle: depreciation, fuel, insurance, repairs and fees',
				`=/tco/${vin}`,
			),
			operation(
				'Get Payments',
				'getPayments',
				'Get loan payments for a VIN',
				'Calculate the monthly payment, loan amount, taxes and fees for a vehicle',
				`=/payments/${vin}`,
			),
			operation(
				'Get Taxes and Fees',
				'getTaxes',
				'Get taxes and fees for a VIN',
				'Calculate sales tax and government fees for a vehicle sale in a ZIP code',
				`=/taxes/${vin}`,
			),
		],
		default: 'getPayments',
	},
	vinField({ resource }),
	options(
		['getPayments'],
		[
			creditScore,
			money('Documentation Fee', 'docFee', 'The dealer documentation fee'),
			money('Down Payment', 'downPayment', 'The down payment amount'),
			{
				displayName: 'Interest Rate',
				name: 'interestRate',
				type: 'number',
				typeOptions: { minValue: 0, numberPrecision: 2 },
				default: 0,
				description:
					'Annual rate in percent to price the loan at, instead of the quoted rate for the term',
				routing: query('interestRate'),
			},
			{
				displayName: 'Loan Term',
				name: 'loanTerm',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 72,
				description:
					'Loan term in months. Rates are quoted for 36, 48, 60, 72 and 84 months. For another term, set Interest Rate.',
				routing: query('loanTerm'),
			},
			money(
				'Price',
				'price',
				"The sale price. Defaults to the vehicle's estimated used retail value.",
			),
			money('Trade-In Value', 'tradeIn', 'The value of the trade-in vehicle'),
			zip('Five-digit ZIP code for taxes, fees and rates. Defaults to your account ZIP code.'),
		],
	),
	options(
		['getInterestRates'],
		[
			creditScore,
			{
				displayName: 'Vehicle Age',
				name: 'vehicleAge',
				type: 'number',
				typeOptions: { minValue: 0 },
				default: 1,
				description: 'Age of the vehicle in years. Defaults to the years since its model year.',
				routing: query('vehicleAge'),
			},
			{
				displayName: 'Vehicle Mileage',
				name: 'vehicleMileage',
				type: 'number',
				typeOptions: { minValue: 0 },
				default: 0,
				description: 'Mileage of the vehicle. Defaults to 12,000 miles for each year of age.',
				routing: query('vehicleMileage'),
			},
			zip('Five-digit ZIP code the rates are quoted for. Defaults to your account ZIP code.'),
		],
	),
	options(
		['getTaxes'],
		[
			money('Documentation Fee', 'docFee', 'The dealer documentation fee. Defaults to 200.'),
			money('Down Payment', 'downPayment', 'The down payment amount'),
			{
				displayName: 'Loan Term',
				name: 'months',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 72,
				description: 'Loan term in months',
				routing: query('months'),
			},
			money('Price', 'price', 'The sale price. Defaults to 25,000.'),
			money('Trade-In Value', 'tradeIn', 'Trade-in value, deducted from the taxable amount'),
			zip('Five-digit ZIP code of the sale. Defaults to your account ZIP code.'),
		],
	),
	options(
		['getOwnershipCost'],
		[zip('Five-digit ZIP code used for insurance, taxes and fees')],
	),
];
