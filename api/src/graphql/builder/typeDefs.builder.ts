import { GqlFunc, GqlArg, GqlFieldDataType, GqlQuery, GqlMutation, GqlType, GqlUnion, GqlFieldType, ReturnModel } from '../../types/gql.builder.types.js';
import { trimLines } from '../../utils/helper.js';

class GqlFuncBuilder {
  private parent: TypeDefsBuilder;
  private funcs: GqlFunc[] = [];
  private lastFunc: GqlFunc | null = null;

  constructor(parent: TypeDefsBuilder) {
    this.parent = parent;
  }

  public addFunc(name: string) {
    const length = this.funcs.push({ name, args: [], return: undefined });
    this.lastFunc = this.funcs[length - 1];
  }

  public addArgs(...args: GqlArg[]) {
    if (!this.lastFunc) throw new TypeError('lastFunc is not defined');
    this.lastFunc.args = [...this.lastFunc.args, ...args]
  }

  public addReturnType(returnType: GqlFieldDataType) {
    if (!this.lastFunc) throw new TypeError('lastFunc is not defined');
    this.lastFunc.return = returnType;
  }

  public getLastFunc() {
    if (!this.lastFunc) throw new TypeError('lastFunc is not defined');
    return this.lastFunc;
  }
}

export default class TypeDefsBuilder {
  private queryModel: GqlQuery = { Query: { funcs: [] } };
  private mutationModel: GqlMutation = { Mutation: { funcs: [] } };
  private gqlTypes: GqlType[] = [];
  private gqlUnions: GqlUnion[] = [];
  private funcBuilder = new GqlFuncBuilder(this);
  public shouldAddUploadType = false;

  public addQueryFunc(name: string) {
    this.funcBuilder.addFunc(name);
    this.queryModel.Query.funcs.push(this.funcBuilder.getLastFunc());
  }

  public addMutationFunc(name: string) {
    this.funcBuilder.addFunc(name);
    this.mutationModel.Mutation.funcs.push(this.funcBuilder.getLastFunc());
  }

  public addArgs(...args: GqlArg[]) {
    this.funcBuilder.addArgs(...args);
  }

  public addReturnType(returnType: GqlFieldDataType) {
    this.funcBuilder.addReturnType(returnType);
  }

  public addType(gqlType: GqlType) {
    this.gqlTypes.push(gqlType);
  }

  public addUnion(gqlUnion: GqlUnion) {
    this.gqlUnions.push(gqlUnion);
  }

  public enableUploadType() {
    this.shouldAddUploadType = true;

  }

  public build() {
    const builthUnions = stringifyUnions(this.gqlUnions);
    const builthTypes = stringifyTypes(this.gqlTypes);
    const queryFuncs = stringifyFuncs(this.queryModel.Query.funcs);
    const mutationFuncs = stringifyFuncs(this.mutationModel.Mutation.funcs);
    const schema = `
      ${this.shouldAddUploadType ? 'scalar Upload' : ''}
      ${builthUnions}
      ${builthTypes}
      type Query {
        ${queryFuncs}
      }
      type Mutation {
        ${mutationFuncs}
      }
    `;

    return trimLines(schema);
  }
}

function stringifyTypes(gqlTypes: GqlType[]): string {
  const stringifiedTypes = gqlTypes
    .reduce((a: string, c: GqlType) => {
      const jsonFields = Object.keys(c.fields)
        .map((k: string) => {
          const field = c.fields[k];
          return field.isArray
            ? ` ${k}: [${field.type}${field.isMandatory ? '!' : ''}]${field.isMandatory ? '!' : ''}`
            : ` ${k}: ${field.type}${field.isMandatory ? '!' : ''}`;
        })
        .join('\n');
      a += `type ${c.name} {\n${jsonFields}\n}\n`;

      return a;
    },
      ''
    );

  return stringifiedTypes.trim();
}

function stringifyFuncArgs(args: GqlArg[]): string {
  const mappedArgs = args.map((arg: GqlArg) =>
    arg.isArray
      ? `[${arg.name}:${arg.type}${arg.isMandatory ? '!' : ''}]${arg.isMandatory ? '!' : ''}`
      : `${arg.name}:${arg.type}${arg.isMandatory ? '!' : ''}`);
  const stringifiedArgs = mappedArgs.join(', ');

  return stringifiedArgs;
}

function stringifyFuncs(gqlFuncs: GqlFunc[]): string {
  const stringifiedFuncs = gqlFuncs.reduce((a: string, c: GqlFunc) => {
    if (!c.return) throw new TypeError('retunModel should be defined');
    const funcName = c.name;
    const args = c.args.length ? `(${stringifyFuncArgs(c.args)})` : '';
    const returningValue = stringifyFieldDataType(c.return.type, !!c.return.isMandatory, !!c.return.isArray);

    return `${a}${funcName}${args}:${returningValue}\n`;
  }, '');

  return stringifiedFuncs.trim();
}

function stringifyUnions(gqlUnions: GqlUnion[]): string {
  const stringifiedUnions = gqlUnions.reduce((a: string, c: GqlUnion) => {
    const unionPrefix = `union ${c.name} =`;
    const mappedTypes = c.models.map(m => stringifyFieldDataType(m.type, !!m.isMandatory, !!m.isArray));
    const strigifiedModels = mappedTypes.join(' | ');
    return `${a}${unionPrefix} ${strigifiedModels}\n`;
  }, '');

  return stringifiedUnions.trim();
}

function stringifyFieldDataType(type: GqlFieldType | ReturnModel, isMandatory: boolean, isArray: boolean) {
  return isArray
    ? `[${type}${isMandatory ? '!' : ''}]${isMandatory ? '!' : ''}`
    : `${type}${isMandatory ? '!' : ''}`;
}
