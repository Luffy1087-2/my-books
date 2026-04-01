import { createContext } from "react";
import { decryptJsonTokenData, UserEntityModel } from "@my-books/core";

const userToken = sessionStorage.getItem('userToken');
const user = userToken ? decryptJsonTokenData<UserEntityModel>(userToken) : null;
export const UserContext = createContext<UserEntityModel | null>(user);
