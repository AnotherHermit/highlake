import crypto from 'crypto';

import OAuth from 'oauth-1.0a';

import { apis } from '../secrets.json';

const { consumer, token } = apis.telldus;

const oauth = new OAuth({
  consumer,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  signature_method: 'HMAC-SHA1',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  hash_function: (baseString, key) =>
    crypto.createHmac('sha1', key).update(baseString).digest('base64'),
});

export const getHeaders = (requestData: OAuth.RequestOptions) =>
  oauth.toHeader(oauth.authorize(requestData, token));
