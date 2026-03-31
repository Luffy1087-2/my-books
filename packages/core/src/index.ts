import CryptoJS from 'crypto-js';

export const CLIENT_ID = process.env.REACT_APP_SSO_CLIENT_ID as string;
export const SECRET_KEY = process.env.REACT_APP_SSO_CLIENT_SECRET as string;
export const DB_USER = process.env.REACT_APP_DB_USER as string;
export const DB_PASSWORD = process.env.REACT_APP_DB_PASSWORD as string;
export const DB_NAME = process.env.REACT_APP_DB_NAME as string;
export const DB_HOST = process.env.REACT_APP_DB_HOST as string;
export const DB_PORT = process.env.REACT_APP_DB_PORT as string;

export function encryptToken(dataString: string): string {
  return CryptoJS.AES.encrypt(dataString, SECRET_KEY).toString();
};

export function decryptJsonTokenData<R>(data: string): R | null {
  try {
    const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
    const bsString = bytes.toString(CryptoJS.enc.Utf8);
    const json = JSON.parse(bsString);
    return json as R;
  } catch {
    return null;
  }
};
