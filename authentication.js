// Befores

const includeApiKey = (request, z, bundle) => {
  if (bundle.authData.accessToken) {
    request.headers.Authorization = `Basic ${Buffer.from(`:${bundle.authData.accessToken}`).toString('base64')}`;
  }

  return request;
};

// Afters

const handleBadResponses = (response, z, bundle) => {
  if (response.status === 401) {
    throw new z.errors.Error(
      // This message is surfaced to the user
      'The access token you supplied is incorrect',
      'AuthenticationError',
      response.status
    );
  }

  return response;
};

// Here we go

module.exports = {
  config: {
    type: 'custom',

    fields: [
      {
        key: 'accessToken',
        label: 'Personal Access Token (or OAuth access token)',
        required: true
      },
    ],

    test: (z, bundle) => z.request({ url: 'https://api.github.com/user' }),

    connectionLabel: '{{json.login}}',
  },
  befores: [includeApiKey],
  afters: [handleBadResponses],
};
