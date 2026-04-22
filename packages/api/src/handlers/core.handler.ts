import { IncomingMessage, ServerResponse } from "http";
import { GoogleUserModel, isGoogleUserModelValid, UserEntityModel } from '@my-books/core';
import { isUserEntityValid } from '../utils/model.utils.js';
import { jwtDecode } from 'jwt-decode';
import { decryptWebTokenData } from '../utils/crypto.utils.js';

export function tryGetGoogleUserModelFromJwtToken(jwtToken: string | string[] | undefined) {
  if (typeof jwtToken !== 'string' || !jwtToken.length) throw new TypeError('jwtToken is not valid');
  const model = jwtDecode(jwtToken) as GoogleUserModel;
  if (!model) throw new TypeError('jwtToken is not valid');
  if (!isGoogleUserModelValid(model)) throw new TypeError('GoogleUserModel is not valid');

  return model;
}

export function getUserTokenHandler(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
  const jwtToken = req.headers['x-jwt-google-auth-token'];
  if (jwtToken?.length) return { req, res };
  const tokenFromHeader = req.headers["authorization"];
  if (!tokenFromHeader) throw new TypeError('authorization header is not present');
  const userEntityEncodedToken = tokenFromHeader!.startsWith('Bearer ') ? tokenFromHeader!.toString().split(' ')[1] : undefined;
  if (typeof userEntityEncodedToken !== 'string') throw new TypeError('token should be present in the header');
  const decryptedData = decryptWebTokenData<UserEntityModel | null>(userEntityEncodedToken);
  if (!isUserEntityValid(decryptedData)) throw new TypeError('user data is not wrong');
  return { user: decryptedData, req, res };
}
