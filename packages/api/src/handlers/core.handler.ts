import { IncomingMessage } from "http";
import { BypassAuthModel, decryptWebTokenData, getEnvByKey, UserEntityModel } from '@my-books/core';
import { isUserEntityValid } from '../utils/model.utils.js';

function isValidByPassToken(bypassAuthToken: string | string[]) {
  if (typeof bypassAuthToken !== 'string' || !bypassAuthToken.length) throw new TypeError('bypassAuthToken is not valid');
  const model = decryptWebTokenData<BypassAuthModel>(bypassAuthToken);
  if (!model) throw new TypeError('BypassAuthModel is not valid');
  const endTime = Date.now();
  const isExpired = endTime - model.startTime > 5000;
  if (isExpired) throw new RangeError('bypassAuthToken is expired');
  if (model.pw !== getEnvByKey('BYPASS_PROTECTION_PW')) throw new Error('protection is not guaranteed');

  return true;
}

export function getUserTokenHandler(req: IncomingMessage) {
  const bypassAuthToken = req.headers['x-auth-bypass-token'];
  if (bypassAuthToken && isValidByPassToken(bypassAuthToken)) return {};
  const tokenFromHeader = req.headers["authorization"];
  if (!tokenFromHeader) throw new TypeError('authorization header is not present');
  const encodedToken = tokenFromHeader!.startsWith('Bearer ') ? tokenFromHeader!.toString().split(' ')[1] : undefined;
  if (typeof encodedToken !== 'string') throw new TypeError('token should be present in the header');
  const decryptedData = decryptWebTokenData<UserEntityModel | null>(encodedToken);
  if (!isUserEntityValid(decryptedData)) throw new TypeError('user data is not wrong');
  return { user: decryptedData };
}
