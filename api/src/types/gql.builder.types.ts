export type GqlArg = {
  name: string;
  type: GqlFieldType;
  isMandatory?: boolean;
  isArray?: boolean
};
export type GqlFunc = {
  name: string;
  args: GqlArg[];
  return: GqlFieldDataType | undefined;
};
export type GqlFieldDataType = {
  type: GqlFieldType | ReturnModel;
  isArray?: boolean;
  isMandatory?: boolean;
};
export type GqlQuery = {
  Query: {
    funcs: GqlFunc[];
  };
};
export type GqlMutation = {
  Mutation: {
    funcs: GqlFunc[];
  };
};
export type GqlType = {
  name: string;
  fields: {
    [field: string]: GqlFieldDataType
  };
};
export type GqlUnion = {
  name: string,
  models: GqlFieldDataType[]
};
export type GqlFieldType = 'String' | 'ID' | 'Int' | 'Bytes';
export type ReturnModel = 'User' | 'Book' | 'ErrorResponse' | 'UserOrErrorResult' | 'BookOrErrorResult' | 'BooksOrErrorResult';
