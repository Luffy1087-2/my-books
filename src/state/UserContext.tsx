import { JwtPayload } from "jwt-decode";
import { createContext } from "react";

const storage = localStorage.getItem('user');
const user = storage ? JSON.parse(storage) : null;
export const UserContext = createContext<TUserContext>(user);
export type TUserContext = JwtPayload & {
  family_name: string,
  given_name: string,
  email: string,
  email_verified: boolean,
  setUserState: (data: TUserContext) => void
};