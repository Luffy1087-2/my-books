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
    const fieldsString = this.getFieldsOrSubQuery(query?.fields);
    let select = 'SELECT'
      .concat(' ', fieldsString)
      .concat(' FROM ', query.from!);
    select += query.where.length ? ' ' + this.buildWhere(query) : '';
    select += query.orderBy ? ' ' + this.buildOrderBy(query) : '';
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

  private buildWhere(query: QuerySelect): string {
    let where = 'WHERE';
    for (let i = 0; i < query.where.length; i++) {
      const whereModel = query.where[i];
      where = where.concat(' ', this.getOperandOrSubQuery(whereModel.lOperand, whereModel.operandsQuotes[0]));
      where = where.concat(' ', whereModel.operator);
      where = where.concat(' ', this.getOperandOrSubQuery(whereModel.rOperand, whereModel.operandsQuotes[1]));
      if (!whereModel.rLogicOperand || whereModel.rLogicOperand && query.where[i + 1]) continue;
      where = where.concat(' ', whereModel.rLogicOperand);
    }
    return where;
  }

  private getOperandOrSubQuery(where: string | number | QuerySelect, hasQuotes: boolean): string {
    if (!Array.isArray(where) && typeof where === 'object')
      return `( ${this.build(where)}) `;
    if (typeof where === 'number' || typeof where === 'string')
      return hasQuotes ? `'${where.toString()}'` : where.toString();
    throw new TypeError('operand should be a string or an object');
  }

  private buildOrderBy(query: QuerySelect): string {
    let orderBy = 'ORDER BY';
    orderBy = orderBy.concat(' ORDER BY');
    orderBy = orderBy.concat(' ', query.orderBy!.field);
    orderBy = orderBy.concat(' ', query.orderBy!.direction);
    return orderBy;
  }
}