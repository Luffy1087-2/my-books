import CryptoJS from 'crypto-js';
import { getEnvByKey } from './env.core.js';

export function encryptToWebToken(dataString: string): string {
  const encryptedString = CryptoJS.AES.encrypt(dataString, getEnvByKey('SSO_SECRET_KEY'));
  const base64String = encryptedString.toString(CryptoJS.format.OpenSSL);
  const encodedString = encodeURIComponent(base64String);

  return encodedString;
};

export function decryptWebTokenData<R>(encodedString: string): R | null {
  try {
    const SECRET_KEY = getEnvByKey('SSO_SECRET_KEY');
    if (!SECRET_KEY || !SECRET_KEY.length) throw new TypeError('SSO_SECRET_KEY is not defined');
    const decodedString = decodeURIComponent(encodedString);
    if (!decodedString || !decodedString.length) throw new TypeError('decodedString is not valid');
    const decodedBase64String = CryptoJS.AES.decrypt(decodedString, SECRET_KEY);
    if (!decodedBase64String) throw new TypeError('decodedBase64String is not valid');
    const decodedDataString = decodedBase64String.toString(CryptoJS.enc.Utf8);
    if (!decodedDataString || !decodedDataString.length) throw new TypeError('decodedDataString is not valid');
    const json = JSON.parse(decodedDataString);

    return json as R;
  } catch (e: any) {
    console.log('decrypt error', e);
    return null;
  }
};
