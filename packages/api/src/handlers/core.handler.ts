import { IncomingMessage } from "http";
import { isUserEntityValid } from '../utils/helper.js'
import { decryptWebTokenData, UserEntityModel } from '@my-books/core';

export function getUserTokenHandler(req: IncomingMessage) {
  const tokenFromHeader = req.headers["authorization"];
  if (!tokenFromHeader) throw new TypeError('authorization header is not present');
  const encodedToken = tokenFromHeader!.startsWith('Bearer ') ? tokenFromHeader!.toString().split(' ')[1] : undefined;
  if (typeof encodedToken !== 'string') throw new TypeError('token should be present in the header');
  const decryptedData = decryptWebTokenData<UserEntityModel | null>(encodedToken);
  console.log('decryptedData', decryptedData);
  if (!isUserEntityValid(decryptedData)) throw new TypeError('user data is not wrong');
  return { user: decryptedData };
}