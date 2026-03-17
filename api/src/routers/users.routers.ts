import { Router } from "express";
import { ValidUser } from "../types/user";
import DbService from "../services/db.service";
import SelectQueryBuilder from "../db/builder/select-query.builder";
import InsertQueryBuilder from "../db/builder/insert-query.builder";

const usersRouters: Router = Router();
usersRouters.get('/user/getOrInsert', async (req, res) => {
  try {
    const user: ValidUser = res.locals.user;
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
      return res.status(200).json(data!.rows[0]);
    }
    const iData = await insertUser(user, await isUsersTableEmpty());
    return res.status(201).json(iData);
  } catch(e: any) {
    return res.status(500).json({msg: e.message});
  }
});

async function isUsersTableEmpty(): Promise<boolean> {
  try {
    const query = new SelectQueryBuilder('users');
    const select = query
      .withFields('COUNT(*)')
      .withLimit(1)
      .build();
    const data = await DbService.query(select);
    
    return data?.rowCount == 0;
  } catch(e: any) {
    throw new Error('isUserTableEmpty raised the error: ' + e.message);
  }
}

async function insertUser(user: ValidUser, isAdmin: boolean) {
 try {
  const query = new InsertQueryBuilder('users')
    .withFields('id', 'name', 'email', 'u_role')
    .withValues(user.sub, user.given_name, user.email, Number(isAdmin).toString())
    .withReturning('id', 'name', 'email', 'u_role')
    .build();
  const data = await DbService.query(query);
  return data?.rows[0];
 } catch(e: any) {
  throw new Error('insertUser raises the error: ' + e.message);
 }
}

export default usersRouters;