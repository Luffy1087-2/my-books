import { UserEntityModel } from '@my-books/core';
import { ErrorResponse } from '../types/data.types.js';
import { hasError } from '../utils/model.utils.js';
import { createUserIfNotExists } from '../handlers/users.handler.js';

export const resolvers = {
  Query: {
  },
  Mutation: {
    createUserIfNotExists: async (parent: any, { googleToken }: { googleToken: string }): Promise<UserEntityModel | ErrorResponse> => {
      return await createUserIfNotExists(googleToken);
    }
  },
  UserOrErrorResult: {
    __resolveType: (obj: any) => hasError(obj) ? 'ErrorResponse' : 'User'
  }
};