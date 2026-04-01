import { GoogleUserModel } from '@my-books/core';
import { hasError } from '../utils/helper.js';
import createUserIfNotExists from '../handlers/users.handler.js';

export default {
  Query: {
  },
  Mutation: {
    createUserIfNotExists: async (parent: any, args: any, context: { user: GoogleUserModel }) => {
      return await createUserIfNotExists(context.user);
    }
  },
  UserOrErrorResult: {
    __resolveType: (obj: any) => hasError(obj) ? 'ErrorResponse' : 'User'
  }
}