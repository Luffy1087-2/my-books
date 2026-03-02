import { JwtPayload } from "jwt-decode";
import { createContext } from "react";
import { decryptJsonTokenData } from "@my-books/core";

const userToken = sessionStorage.getItem('userToken');
const user = userToken ? decryptJsonTokenData(userToken) : null;
export const UserContext = createContext<TUserContext>(user as TUserContext);
export type TUserContext = null | (JwtPayload & {
  family_name?: string,
  given_name?: string,
  email?: string,
  email_verified?: boolean,
  setUserState: (data: TUserContext) => void
});