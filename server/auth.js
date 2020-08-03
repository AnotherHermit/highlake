const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const { consumer, token } = require('../temp/keys');

const oauth = OAuth({
  consumer,
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
      return crypto
          .createHmac('sha1', key)
          .update(base_string)
          .digest('base64')
  },
})

const getHeaders = requestData => oauth.toHeader(oauth.authorize(requestData, token));

module.exports = {
  getHeaders,
};
