import CryptoJS from 'crypto-js';

export const CLIENT_ID = process.env.REACT_APP_SSO_CLIENT_ID as string;
export const SECRET_KEY = process.env.REACT_APP_SSO_CLIENT_SECRET as string;
export const DB_USER = process.env.REACT_APP_DB_USER as string;
export const DB_PASSWORD = process.env.REACT_APP_DB_PASSWORD as string;
export const DB_NAME = process.env.REACT_APP_DB_NAME as string;
export const DB_HOST = process.env.REACT_APP_DB_HOST as string;
export const DB_PORT = process.env.REACT_APP_DB_PORT as string;

export function encryptToWebToken(dataString: string): string {
  const encryptedString = CryptoJS.AES.encrypt(dataString, SECRET_KEY);
  const base64String = encryptedString.toString(CryptoJS.format.OpenSSL);
  const encodedString = encodeURIComponent(base64String);

  return encodedString;
};

export function decryptWebTokenData<R>(encodedString: string): R | null {
  try {
    if (!SECRET_KEY || !SECRET_KEY.length) throw new TypeError('SECRET_KEY is not defined');
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

export * from './session-models.core.js';

