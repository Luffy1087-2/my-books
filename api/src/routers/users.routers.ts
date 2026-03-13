import { Router } from "express";
import { ValidUser } from "../types/user";
import DbClient from "../db/db.client";
import QuerySelect from "../db/select.query";
import QueryInsert from "../db/insert.query";

const usersRouters: Router = Router();
usersRouters.get('/getUserOrInsert', async (req, res) => {
  try {
    const user: ValidUser = res.locals.user;
    const query = new QuerySelect('users');
    const select = query
      .withFields('id', 'name', 'email', 'u_role')
      .withWhere({
        lOperand: 'id',
        operator: '=',
        rOperand: user.sub
      })
      .build();
    const data = await DbClient.connect().query(select);
    if (data?.rowCount === 1) {
      return res.status(200).json(data!.rows[0]);
    }
    const iData = await insertUser(user, await isUsersTableEmpty());
    return res.status(201).json(iData);
  } catch(e: any) {
    return res.status(500).json(e.message);
  }
});

async function isUsersTableEmpty(): Promise<boolean> {
  try {
    const query = new QuerySelect('users');
    const select = query
      .withFields('COUNT(*)')
      .withLimit(1)
      .build();
    const data = await DbClient.query(select);
    
    return data?.rowCount == 0;
  } catch(e: any) {
    throw new Error('isUserTableEmpty raised the error: ' + e.message);
  }
}

async function insertUser(user: ValidUser, isAdmin: boolean) {
 try {
  const query = new QueryInsert('users')
    .withFields('id', 'name', 'email', 'u_role')
    .withValues(user.sub, user.given_name, user.email, Number(isAdmin).toString())
    .withReturning('id', 'name', 'email', 'u_role')
    .build();
  const data = await DbClient.query(query);
  return data?.rows[0];
 } catch(e: any) {
  throw new Error('insertUser raines the error: ' + e.message);
 }
}

export default usersRouters;