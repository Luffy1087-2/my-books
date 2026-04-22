import { createContext } from "react";
import { UserEntityModel } from "@my-books/core";

export const UserContext = createContext<UserEntityModel | null>(null);
