'use strict';
import { type Express }  from 'express';
import express from 'express';
import {decryptJsonTokenData} from '@my-books/core';

type ValidUser = {
  sub: string,
  given_name: string
}
const isValidUser = (user: ValidUser) => {
  return user &&
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
  const decodedData = decryptJsonTokenData(token!);
  if (!decodedData || !isValidUser(decodedData as ValidUser)) return res.status(403).json('user data is not wrong');
  res.locals.user = decodedData;
  next();
});

export default app;