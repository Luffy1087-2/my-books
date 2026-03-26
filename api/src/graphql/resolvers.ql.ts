import createUserIfNotExists from "../handlers/users.handler";
import { GoogleUser } from "../types/data.types"
import { hasError } from "../utils/helper";

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