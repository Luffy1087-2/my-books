import CryrtoSign  from 'crypto-js';
export const CLIENT_ID = process.env.REACT_APP_SSO_CLIENT_ID as string;
export const SECRET_KEY = process.env.REACT_APP_SSO_CLIENT_SECRET as string;
export const DB_USER = process.env.REACT_APP_DB_USER as string;
export const DB_PASSWORD = process.env.REACT_APP_DB_PASSWORD as string;
export const DB_NAME = process.env.REACT_APP_DB_NAME as string;

export function encryptToken(dataString: string): string {
  return CryrtoSign.AES.encrypt(dataString, SECRET_KEY).toString();
};

export function decryptJsonTokenData(data: string): object {
  const bytes = CryrtoSign.AES.decrypt(data, SECRET_KEY);
  const bsString = bytes.toString(CryrtoSign.enc.Utf8);
  const json = JSON.parse(bsString);
  
  return json;
};
