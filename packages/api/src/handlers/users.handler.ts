import { DBUser, ErrorResponse } from '../types/data.types.js';
import { exWithContext, getErrorModel } from '../utils/helper.js';
import { GoogleUserModel } from '@my-books/core';
import SelectQueryBuilder from '../db/builder/select-query.builder.js';
import InsertQueryBuilder from '../db/builder/insert-query.builder.js';
import DbService from '../services/db.service.js';

const createUserIfNotExists = async (user: GoogleUserModel): Promise<DBUser | ErrorResponse> => {
  try {
    if (!user || !user.sub || !user.sub.length) throw new TypeError('session is not valid');
    const query = new SelectQueryBuilder('users');
    const select = query
      .withFields('id', 'name', 'email', 'u_role')
      .withWhere({
        lOperand: 'id',
        operator: '=',
        rOperand: user.sub
      })
      .build();
    const data = await DbService.query(select);
    if (data?.rowCount === 1) {
      return data!.rows[0];
    }
    const iData = await insertUser(user, await isUsersTableEmpty());
    return iData;
  } catch (e: any) {
    return getErrorModel(e.message);
  }
};

async function isUsersTableEmpty(): Promise<boolean> {
  try {
    const query = new SelectQueryBuilder('users');
    const select = query
      .withFields('COUNT(*)')
      .withLimit(1)
      .build();
    const data = await DbService.query(select);

    return data?.rowCount == 0;
  } catch (e: any) {
    throw new Error(exWithContext(e.message, 'isUsersTableEmpty'));
  }
}

async function insertUser(user: GoogleUserModel, isAdmin: boolean): Promise<DBUser> {
  try {
    const query = new InsertQueryBuilder('users')
      .withFields('id', 'name', 'email', 'u_role')
      .withValues(user.sub, user.given_name, user.email, Number(isAdmin).toString())
      .withReturning('id', 'name', 'email', 'u_role')
      .build();
    const data = await DbService.query(query);
    return data?.rows[0] as DBUser;
  } catch (e: any) {
    throw new Error(exWithContext(e.message, 'insertUser'));
  }
}

export { createUserIfNotExists };