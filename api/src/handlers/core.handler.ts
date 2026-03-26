import { IncomingMessage } from "http";
import { isValidUser } from "../utils/helper";
import { decryptJsonTokenData } from "@my-books/core";
import { GoogleUser } from "../types/data.types";

export function getUserTokenHandler(req: IncomingMessage) {
  const tokenFromHeader = req.headers["authorization"];
  if (!tokenFromHeader) throw new TypeError('authorization header is not present');
  const token = tokenFromHeader!.startsWith('Bearer ') ? tokenFromHeader!.toString().split(' ')[1] : undefined;
  if (typeof token !== 'string') throw new TypeError('token should be present in the header');
  const decodedData = decryptJsonTokenData<GoogleUser>(token!);
  if (!isValidUser(decodedData)) throw new TypeError('user data is not wrong');
  return { user: decodedData };
}