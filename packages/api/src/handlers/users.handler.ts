import { decryptWebTokenData, GoogleUserModel, UserEntityModel } from '@my-books/core';
import { DBUser, ErrorResponse } from '../types/data.types.js';
import { exceptionStringified, getErrorModel } from '../utils/model.utils.js';
import SelectQueryBuilder from '../db/builder/select-query.builder.js';
import InsertQueryBuilder from '../db/builder/insert-query.builder.js';
import DbService from '../services/db.service.js';

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

async function createUserIfNotExists(googleToken: string): Promise<UserEntityModel | ErrorResponse> {
  try {
    const user = decryptWebTokenData<GoogleUserModel>(googleToken);
    if (!user?.sub.length) throw new TypeError('session is not valid');
    const query = new SelectQueryBuilder('users');
    const select = query
      .withFields('id', '"gId"', 'name', 'email', 'u_role')
      .withWhere({
        lOperand: '"gId"',
        operator: '=',
        rOperand: user.sub,
        operandsQuotes: [false, true]
      })
      .build();
    const data = await DbService.query(select);
    if (data.rowCount === 1) {
      return mapToUserEntityModel(data.rows[0]);
    }
    const iData = await insertUser(user, await isUsersTableEmpty());
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

export { createUserIfNotExists };