import { TQueryInsert as TInsertQuery } from "../../types/builder.types";
import { arrayToQueryValues } from "../../utils/helper";

export default class InsertQueryBuilder {
  private readonly query: TInsertQuery;

  constructor(tableName: string) {
    this.query = { 
      table: tableName,
      fields: [],
      values: [],
      returning: []
    };
  }

  public withFields(...fields: string[]): this {
    this.query.fields = fields;

    return this;
  }

  public withValues(...values: string[]): this {
    this.query.values = values;

    return this;
  }

  public withReturning(...values: string[]): this {
    this.query.returning = values;

    return this;
  }

  public build(): string  {
    const fieldsString = arrayToQueryValues(this.query.fields);
    const select = 'INSERT INTO'
      .concat(' ', this.query.table)
      .concat(' ( ', fieldsString, ' )')
      .concat(' VALUES (', arrayToQueryValues(this.query.values, true), ' )')
      .concat(' RETURNING ', arrayToQueryValues(this.query.returning))
    return select;
  }

}