const authentication = require('./authentication');

const reverse = require('./creates/reverse');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: authentication.config,

  beforeRequest: [...authentication.befores],
  afterResponse: [...authentication.afters],

  triggers: {},

  searches: {},

  creates: {
    [reverse.key]: reverse
  },

  resources: {},
};
