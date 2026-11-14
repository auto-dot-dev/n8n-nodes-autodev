import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AutoDevApi implements ICredentialType {
	name = 'autoDevApi';

	displayName = 'Auto.dev API';

	icon: Icon = { light: 'file:../icons/autodev.svg', dark: 'file:../icons/autodev.dark.svg' };

	documentationUrl = 'https://docs.auto.dev/v2/getting-started';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'Your Auto.dev API key. Create one at https://www.auto.dev/dashboard/api-keys.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials?.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.auto.dev',
			url: '/example',
			method: 'GET',
		},
	};
}
