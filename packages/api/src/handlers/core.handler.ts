import { IncomingMessage } from "http";
import { decryptWebTokenData, UserEntityModel } from '@my-books/core';
import { isUserEntityValid } from '../utils/model.utils.js';

export function getUserTokenHandler(req: IncomingMessage) {
  const shouldBypass = req.headers['x-auth-bypass'] === 'true';
  if (shouldBypass) return {};
  const tokenFromHeader = req.headers["authorization"];
  if (!tokenFromHeader) throw new TypeError('authorization header is not present');
  const encodedToken = tokenFromHeader!.startsWith('Bearer ') ? tokenFromHeader!.toString().split(' ')[1] : undefined;
  if (typeof encodedToken !== 'string') throw new TypeError('token should be present in the header');
  const decryptedData = decryptWebTokenData<UserEntityModel | null>(encodedToken);
  if (!isUserEntityValid(decryptedData)) throw new TypeError('user data is not wrong');
  return { user: decryptedData };
}
