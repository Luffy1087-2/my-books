// Types
import { GoogleUserModel, UserEntityModel } from '@my-books/core';
import { ContextData, ErrorResponse } from '../types/data.types.js';
import { DBUser } from '../types/db.types.js';

// Utils
import { exceptionStringified, getErrorModel } from '../utils/model.utils.js';
import { tryGetGoogleUserModelByAccessToken } from './core.handler.js';
import { encryptToWebToken } from '../utils/crypto.utils.js';
import { dbUserToUserEntityModel } from '../map/userEntityModel.map.js';

// Main
import DbService from '../services/db.service.js';
import SelectQueryBuilder from '../db/builder/select-query.builder.js';
import InsertQueryBuilder from '../db/builder/insert-query.builder.js';

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
      .withFields('"gId"', 'name', 'email', '"avatarUrl"', 'u_role')
      .withValues(user.sub, user.given_name, user.email, user.avatarUrl, Number(isAdmin))
      .withReturning('id', '"gId"', 'name', 'email', '"avatarUrl"', 'u_role')
      .build();
    const data = await DbService.query(query);
    const row = data.rows[0] as DBUser;
    const roleNumber = Number(isAdmin) + 1 as (1 | 2);
    const userEntity = dbUserToUserEntityModel(row, roleNumber);
    return userEntity;
  } catch (e: any) {
    throw new Error(exceptionStringified(e.message, 'insertUser'));
  }
}

async function createUserIfNotExists(contextData: ContextData): Promise<UserEntityModel | ErrorResponse> {
  try {
    // Select
    const accessToken = contextData.req.headers['x-google-access-token'];
    const googleUserModel = await tryGetGoogleUserModelByAccessToken(accessToken);
    const selectedUserOrDefault = await tryGetUserByGoogleId(googleUserModel.sub, contextData);
    if (selectedUserOrDefault) return selectedUserOrDefault;

    // Insert
    const insertedRow = await insertUser(googleUserModel, await isUsersTableEmpty());
    setAuthorizationHeader(insertedRow, contextData);
    return insertedRow;
  } catch (e: any) {
    return getErrorModel(e.message);
  }
};

async function tryGetUserByGoogleId(gId: string, contextData: ContextData) {
  const query = new SelectQueryBuilder('users');
  const select = query
    .withFields('id', '"gId"', 'name', 'email', '"avatarUrl"', 'u_role')
    .withWhere({
      lOperand: '"gId"',
      operator: '=',
      rOperand: `'${gId}'`,
    })
    .build();
  const data = await DbService.query(select);
  if (data.rowCount !== 1) {
    return null;
  }
  const user = dbUserToUserEntityModel(data.rows[0]);
  setAuthorizationHeader(user, contextData);
  return user;
}

async function tryGetUserEntityById(id: string) {
  const query = new SelectQueryBuilder('users');
  const select = query
    .withFields('id', '"gId"', 'name', 'email', '"avatarUrl"', 'u_role')
    .withWhere({
      lOperand: '"id"',
      operator: '=',
      rOperand: id,
    })
    .build();
  const data = await DbService.query(select);
  if (data.rowCount !== 1) throw new RangeError('user cannot be selected');
  const user = dbUserToUserEntityModel(data.rows[0]);
  return user;
}

function setAuthorizationHeader(data: object, ctx: ContextData) {
  const userEntityToken = encryptToWebToken(JSON.stringify(data));
  ctx.res.setHeader('Access-Control-Expose-Headers', 'Authorization');
  ctx.res.setHeader('Authorization', `Bearer ${userEntityToken}`);
}

export { createUserIfNotExists, tryGetUserEntityById };
