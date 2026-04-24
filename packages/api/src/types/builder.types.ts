import { DBOperator } from './db.types.js';

export type QuerySelect = {
  fields: string[] | QuerySelect[] | undefined,
  from?: string,
  where: WhereCondition[],
  union?: QuerySelect,
  orderBy?: OrderBy,
  limit?: number,
  subQueryName?: string
};

export type OrderBy = { field: string, direction: 'ASC' | 'DESC' };

export type WhereCondition = {
  lOperand: string | number | QuerySelect,
  rOperand: string | number | QuerySelect,
  operator: DBOperator,
  rLogicOperand?: string,
};

export type QueryInsert = {
  table: string,
  fields: string[],
  values: (string | number)[],
  returning: string[]
};
