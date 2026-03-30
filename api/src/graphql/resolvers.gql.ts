import createUserIfNotExists from '../handlers/users.handler.js';
import { GoogleUser } from '../types/data.types.js'
import { hasError } from '../utils/helper.js';

export default {
  Query: {
  },
  Mutation: {
    createUserIfNotExists: async (parent: object, args: any, context: { user: GoogleUser }) => {
      return await createUserIfNotExists(context.user);
    }
  },
  UserOrErrorResult: {
    __resolveType: (obj: any) => hasError(obj) ? 'ErrorResponse' : 'User'
  }
}