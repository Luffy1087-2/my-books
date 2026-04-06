import { GoogleUserModel } from '@my-books/core';
import { hasError } from '../utils/helper.js';
import { createUserIfNotExists } from '../handlers/users.handler.js';
import { DBUser, ErrorResponse } from '../types/data.types.js';

export const resolvers = {
  Query: {
  },
  Mutation: {
    createUserIfNotExists: async (parent: any, args: any, context: { user: GoogleUserModel }): Promise<DBUser | ErrorResponse> => {
      return await createUserIfNotExists(context.user);
    }
  },
  UserOrErrorResult: {
    __resolveType: (obj: any) => hasError(obj) ? 'ErrorResponse' : 'User'
  }
};