import { IncomingMessage, ServerResponse } from "http";
import { isGoogleUserModelValid, UserEntityModel } from '@my-books/core';
import { isUserEntityValid } from '../utils/model.utils.js';
import { decryptWebTokenData } from '../utils/crypto.utils.js';
import { userDtoToGoogleUserModel } from '../map/user-api.map.js';

export async function tryGetGoogleUserModelByAccessToken(accessToken: string | string[] | undefined) {
  if (typeof accessToken !== 'string' || !accessToken.length) throw new TypeError('accessToken is not valid');
  const res = await fetch('https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Google api call error: ${res.status}`);
  }
  const model = await res.json();
  const googleModel = userDtoToGoogleUserModel(model);
  if (!isGoogleUserModelValid(googleModel)) throw new TypeError('GoogleUserModel is not valid');

  return googleModel;
}

export function getUserTokenHandler(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
  const accessToken = req.headers['x-google-access-token'];
  if (accessToken?.length) return { req, res };
  const tokenFromHeader = req.headers["authorization"];
  if (!tokenFromHeader) throw new TypeError('authorization header is not present');
  const userEntityEncodedToken = tokenFromHeader!.startsWith('Bearer ') ? tokenFromHeader!.toString().split(' ')[1] : undefined;
  if (typeof userEntityEncodedToken !== 'string') throw new TypeError('token should be present in the header');
  const decryptedData = decryptWebTokenData<UserEntityModel | null>(userEntityEncodedToken);
  if (!isUserEntityValid(decryptedData)) throw new TypeError('user data is not wrong');
  return { user: decryptedData, req, res };
}
