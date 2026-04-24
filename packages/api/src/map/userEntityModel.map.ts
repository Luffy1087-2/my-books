import { UserEntityModel } from '@my-books/core';
import { DBUser } from '../types/db.types.js';

export function dbUserToUserEntityModel(dbUser: DBUser, overrideRole: 1 | 2 | undefined = undefined): UserEntityModel {
  const roleNumber = overrideRole ?? dbUser.u_role;
  const role = roleNumber === 1 ? 'admin' : 'user';
  return {
    id: dbUser.id,
    gId: dbUser.gId,
    name: dbUser.name,
    email: dbUser.email,
    avatarUrl: dbUser.avatarUrl,
    role
  };
}
