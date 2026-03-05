import { TOperator } from "../types/operators";

type TQuerySelect =  { 
  fields?: string[],
  from?: string,
  where: TWhereCondition[],
  union?: TQuerySelect,
  orderBy?: TOrderBy
};

type TOrderBy = {field: string, direction: 'ASC' | 'DESC'};

type TWhereCondition = {
  lOperand: string | TQuerySelect,
  rOperand: string | TQuerySelect,
  operator: TOperator,
  rLogicOperand: string,
};

export default class QuerySelect {
  private readonly query: TQuerySelect;

  constructor(tableName: string) {
    this.query = { where: [] };
    this.withTable(tableName);
  }

  public withFields(fields: string[]) {
    this.query.fields = fields;

    return this;
  }

  public withWhere(condition: TWhereCondition) {
    this.query.where.push(condition);
  };

  public withOrderBy(orderBy: TOrderBy) {
    this.query.orderBy = orderBy;
  }

  public build(rQuery: TQuerySelect | undefined): string  {
    const query = rQuery ?? this.query;
    const fieldsString = query.fields?.reduce((p: string, c: string) => p = p.concat(c,','), '').slice(0, -1);
    if (!fieldsString) throw new TypeError('fieldsString should be defined');
    let select = 'SELECT'
      .concat(' ', fieldsString)
      .concat(' ', query.from!);
    select += !query.where.length ? this.buildWhere(select, query) : '';
    select += query.orderBy ? this.buildOrderBy(select, query) : '';
    return select;
  }

  private withTable(table: string) {
    this.query.from = table;
  }

  private buildWhere(select: string, query: TQuerySelect) {
    select += select.concat(' ', 'WHERE');
    for (let i = 0; i < query.where.length; i++) {
      const where = query.where[i];
      select += select.concat(' ', this.getOperandOrSubQuery(where.lOperand));
      select += select.concat(' ', where.operator);
      select += select.concat(' ', this.getOperandOrSubQuery(where.rOperand));
      if (!where.rLogicOperand || where.rLogicOperand && query.where[i + 1]) continue;
      select += select.concat(' ', where.rLogicOperand);
    }
    return select;
  }

  private getOperandOrSubQuery(where: string | TQuerySelect) {
    if (typeof where === 'string') return where;
    if (!Array.isArray(where) && typeof where === 'object') return `( ${this.build(where)}) `;
    throw new TypeError('operand should be a string or an object');
  }

  private buildOrderBy(select: string, query: TQuerySelect) {
    select += select.concat(' ORDER BY');
    select += select.concat(' ', query.orderBy!.field);
    select += select.concat(' ', query.orderBy!.direction);
    return select;
  }
}