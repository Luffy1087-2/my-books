'use strict';
import { type Express }  from 'express';
import express from 'express';
import {decryptJsonTokenData} from '@my-books/core';

const app: Express = express();
app.use((req, res, next) => {
  const tokenFromHeader = req.headers["authorization"];
  if (!tokenFromHeader) res.status(400).json('authorization header is not present');
  const token = tokenFromHeader!.startsWith('Bearer ') ? tokenFromHeader!.toString().split(' ')[1] : undefined;
  if (typeof token !== 'string') res.status(400).json('token should be present in the header');
  const decodedData = decryptJsonTokenData(token!);
  // res.locals.user = decodedData;
  next();
});

export default app;