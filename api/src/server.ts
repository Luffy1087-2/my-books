'use strict';
import { type Express }  from 'express';
import express from 'express';
import {decryptJsonTokenData} from '@my-books/core';
import { ValidUser } from './types/user';
import usersRouters from './routers/users.routers';
import booksRouters from './routers/books.routers';
import commentsRouters from './routers/comments.routers';

const isValidUser = (user: ValidUser | null): boolean => {
  return user !== null &&
    typeof user.sub === 'string' &&
    /^\d+$/.test(user.sub) &&
    typeof user.given_name === 'string' &&
    /^\w+$/.test(user.given_name);
}
const app: Express = express();
app.use(express.json());
app.use((req, res, next) => {
  const tokenFromHeader = req.headers["authorization"];
  if (!tokenFromHeader) return res.status(400).json('authorization header is not present');
  const token = tokenFromHeader!.startsWith('Bearer ') ? tokenFromHeader!.toString().split(' ')[1] : undefined;
  if (typeof token !== 'string') return res.status(400).json('token should be present in the header');
  const decodedData = decryptJsonTokenData<ValidUser>(token!);
  if (!isValidUser(decodedData)) return res.status(403).json('user data is not wrong');
  res.locals.user = decodedData;
  next();
});
app.use(usersRouters);
app.use(booksRouters);
app.use(commentsRouters);

export default app;