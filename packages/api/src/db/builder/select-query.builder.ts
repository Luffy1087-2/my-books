import { OrderBy, QuerySelect, WhereCondition } from '../../types/builder.types.js';

export default class SelectQueryBuilder {
  private readonly query: QuerySelect;

  constructor(tableName: string) {
    this.query = { where: [], fields: undefined };
    this.withTable(tableName);
  }

  public withFields(...fields: string[] | QuerySelect[]): this {
    this.query.fields = fields;

    return this;
  }

  public withWhere(condition: WhereCondition): this {
    this.query.where.push(condition);

    return this;
  };

  public withOrderBy(orderBy: OrderBy): this {
    this.query.orderBy = orderBy;

    return this;
  }

  public withLimit(limit: number): this {
    this.query.limit = limit;

    return this;
  }

  public withSubQueryName(name: string): this {
    this.query.subQueryName = name;

    return this;
  }

  public build(rQuery?: QuerySelect | undefined | void): string {
    const query = rQuery ?? this.query;
    const fieldsString = this.getFieldsOrSubQuery(rQuery?.fields);
    let select = 'SELECT'
      .concat(' ', fieldsString)
      .concat(' ', query.from!);
    select += !query.where.length ? this.buildWhere(select, query) : '';
    select += query.orderBy ? this.buildOrderBy(select, query) : '';
    select += query.limit ? ' LIMIT ' + query.limit : '';
    select += query.subQueryName ? ' AS ' + query.subQueryName : '';
    return select;
  }

  private withTable(table: string): void {
    this.query.from = table;
  }

  private getFieldsOrSubQuery(fieldsOrSubQuery: string[] | QuerySelect[] | undefined): string {
    if (!fieldsOrSubQuery) throw new TypeError('rQuery should not be empty');
    if (fieldsOrSubQuery.every((v) => typeof v === 'string'))
      return fieldsOrSubQuery.reduce((p: string, c: string) => p = p.concat(c, ','), '').slice(0, -1);

    return '( ' + this.build(fieldsOrSubQuery[0] as QuerySelect) + ' ) ';
  }

  private buildWhere(select: string, query: QuerySelect): string {
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

  private getOperandOrSubQuery(where: string | QuerySelect): string {
    if (typeof where === 'string') return where;
    if (!Array.isArray(where) && typeof where === 'object') return `( ${this.build(where)}) `;
    throw new TypeError('operand should be a string or an object');
  }

  private buildOrderBy(select: string, query: QuerySelect): string {
    select += select.concat(' ORDER BY');
    select += select.concat(' ', query.orderBy!.field);
    select += select.concat(' ', query.orderBy!.direction);
    return select;
  }
}