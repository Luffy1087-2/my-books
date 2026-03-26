import { TOperator } from "./db.types";

export type TQuerySelect =  { 
  fields: string[] | TQuerySelect[] | undefined,
  from?: string,
  where: TWhereCondition[],
  union?: TQuerySelect,
  orderBy?: TOrderBy,
  limit?: number,
  subQueryName?: string 
};

export type TOrderBy = {field: string, direction: 'ASC' | 'DESC'};

export type TWhereCondition = {
  lOperand: string | TQuerySelect,
  rOperand: string | TQuerySelect,
  operator: TOperator,
  rLogicOperand?: string,
};

export type TQueryInsert =  { 
  table: string,
  fields: string[],
  values: string[],
  returning: string[]
};