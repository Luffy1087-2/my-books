export type GqlArg = {
  name: string;
  type: GqlFieldType;
  isMandatory?: boolean;
  isArray?: boolean
};
export type GqlFunc = {
  name: string;
  args: GqlArg[];
  return: GqlReturnType | undefined;
};
export type GqlReturnType = {
  type: GqlFieldType | string;
  isArray: boolean;
  isMandatory: boolean;
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
    [field: string]: GqlFieldType;
  };
};
export type GqlUnion = {
  name: string,
  models: GqlReturnType[]
};
type GqlFieldType = 'String' | 'ID' | 'Int' | 'Bytes';
