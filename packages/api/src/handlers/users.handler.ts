import { GoogleUserModel, UserEntityModel } from '@my-books/core';
import { ContextData, DBUser, ErrorResponse } from '../types/data.types.js';
import { exceptionStringified, getErrorModel } from '../utils/model.utils.js';
import SelectQueryBuilder from '../db/builder/select-query.builder.js';
import InsertQueryBuilder from '../db/builder/insert-query.builder.js';
import DbService from '../services/db.service.js';
import { tryGetGoogleUserModelFromJwtToken } from './core.handler.js';
import { encryptToWebToken } from '../utils/crypto.utils.js';
import { IncomingMessage, ServerResponse } from 'http';

async function isUsersTableEmpty(): Promise<boolean> {
  try {
    const query = new SelectQueryBuilder('users');
    const select = query
      .withFields('COUNT(*)')
      .build();
    const data = await DbService.query(select);

    return Number(data.rows[0].count) === 0;
  } catch (e: any) {
    throw new Error(exceptionStringified(e.message, 'isUsersTableEmpty'));
  }
}

async function insertUser(user: GoogleUserModel, isAdmin: boolean): Promise<UserEntityModel> {
  try {
    const query = new InsertQueryBuilder('users')
      .withFields('gId', 'name', 'email', 'u_role')
      .withValues(user.sub, user.given_name, user.email, Number(isAdmin))
      .withReturning('id', 'gId', 'name', 'email', 'u_role')
      .build();
    const data = await DbService.query(query);
    const row = data.rows[0] as DBUser;
    const roleNumber = Number(isAdmin) + 1 as (1 | 2);
    const userEntity = mapToUserEntityModel(row, roleNumber);
    return userEntity;
  } catch (e: any) {
    throw new Error(exceptionStringified(e.message, 'insertUser'));
  }
}

async function createUserIfNotExists(contextData: ContextData): Promise<UserEntityModel | ErrorResponse> {
  try {
    const jwtToken = contextData.req.headers['x-jwt-google-auth-token'];
    const googleUserModel = tryGetGoogleUserModelFromJwtToken(jwtToken);
    const query = new SelectQueryBuilder('users');
    const select = query
      .withFields('id', '"gId"', 'name', 'email', 'u_role')
      .withWhere({
        lOperand: '"gId"',
        operator: '=',
        rOperand: googleUserModel.sub,
        operandsQuotes: [false, true]
      })
      .build();
    const data = await DbService.query(select);
    if (data.rowCount === 1) {
      const user = mapToUserEntityModel(data.rows[0]);
      setAuthorizationHeader(user, contextData);
      return user;
    }
    const iData = await insertUser(googleUserModel, await isUsersTableEmpty());
    setAuthorizationHeader(iData, contextData);
    return iData;
  } catch (e: any) {
    return getErrorModel(e.message);
  }
};

function mapToUserEntityModel(dbUser: DBUser, overrideRole: 1 | 2 | undefined = undefined): UserEntityModel {
  const roleNumber = overrideRole ?? dbUser.u_role;
  const role = roleNumber === 1 ? 'admin' : 'user';
  return {
    id: dbUser.id,
    gId: dbUser.gId,
    name: dbUser.name,
    email: dbUser.email,
    role
  };
}

function setAuthorizationHeader(data: object, ctx: ContextData) {
  const userEntityToken = encryptToWebToken(JSON.stringify(data));
  ctx.res.setHeader('Access-Control-Expose-Headers', 'Authorization');
  ctx.res.setHeader('Authorization', `Bearer ${userEntityToken}`);
}

export { createUserIfNotExists };