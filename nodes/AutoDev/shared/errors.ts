import type {
	IExecuteSingleFunctions,
	IN8nHttpFullResponse,
	INodeExecutionData,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

/** What to do about each status the API answers with. */
const FIXES: Record<number, string> = {
	400: 'Check the values you entered. A VIN is 17 characters and a ZIP code is 5 digits.',
	401: 'Check the API key in your Auto.dev credential. You can create a key at https://www.auto.dev/dashboard/api-keys.',
	402: 'This operation is not included in your Auto.dev plan. Compare plans at https://www.auto.dev/pricing.',
	403: 'This operation is not included in your Auto.dev plan. Compare plans at https://www.auto.dev/pricing.',
	404: 'Auto.dev has no record for this value. Check it and try again.',
	429: 'You reached the request limit for your Auto.dev plan. Wait a moment and try again, or add a Wait node between requests.',
};

/** The message the API sent, whether `error` is an object or a string. */
export function apiMessage(body: unknown): string | undefined {
	if (!body || typeof body !== 'object') return undefined;
	const { error, message } = body as { error?: unknown; message?: unknown };
	if (typeof error === 'string') return error;
	if (error && typeof error === 'object') {
		const inner = (error as { message?: unknown }).message;
		if (typeof inner === 'string') return inner;
	}
	return typeof message === 'string' ? message : undefined;
}

export function describeError(statusCode: number, body: unknown) {
	return {
		message: apiMessage(body) ?? `Auto.dev answered with status ${statusCode}`,
		description:
			FIXES[statusCode] ??
			(statusCode >= 500
				? 'Auto.dev could not complete the request. Try again in a moment.'
				: 'Check the values you entered and try again.'),
		httpCode: String(statusCode),
	};
}

/** First step after every request: turn an error answer into one that says how to fix it. */
export async function handleErrors(
	this: IExecuteSingleFunctions,
	items: INodeExecutionData[],
	response: IN8nHttpFullResponse,
): Promise<INodeExecutionData[]> {
	if (response.statusCode < 400) return items;
	throw new NodeApiError(
		this.getNode(),
		(response.body ?? {}) as JsonObject,
		describeError(response.statusCode, response.body),
	);
}
