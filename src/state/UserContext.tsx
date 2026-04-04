import { createContext } from "react";
import { decryptWebTokenData, UserEntityModel } from "@my-books/core";

const encodedUserToken = sessionStorage.getItem('userToken');
const user = encodedUserToken ? decryptWebTokenData<UserEntityModel>(encodedUserToken) : null;
export const UserContext = createContext<UserEntityModel | null>(user);
