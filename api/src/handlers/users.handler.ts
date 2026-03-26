
import { DBUser, ErrorResponse, GoogleUser } from "../types/data.types";
import SelectQueryBuilder from "../db/builder/select-query.builder";
import InsertQueryBuilder from "../db/builder/insert-query.builder";
import DbService from "../services/db.service";
import { exWithContext, getErrorModel } from "../utils/helper";

const createUserIfNotExists = async (user: GoogleUser): Promise<DBUser | ErrorResponse> => {
  try {
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
  } catch(e: any) {
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
  } catch(e: any) {
    throw new Error(exWithContext(e.message, 'isUsersTableEmpty'));
  }
}

async function insertUser(user: GoogleUser, isAdmin: boolean): Promise<DBUser> {
 try {
  const query = new InsertQueryBuilder('users')
    .withFields('id', 'name', 'email', 'u_role')
    .withValues(user.sub, user.given_name, user.email, Number(isAdmin).toString())
    .withReturning('id', 'name', 'email', 'u_role')
    .build();
  const data = await DbService.query(query);
  return data?.rows[0] as DBUser;
 } catch(e: any) {
  throw new Error(exWithContext(e.message, 'insertUser'));
 }
}

export default createUserIfNotExists;