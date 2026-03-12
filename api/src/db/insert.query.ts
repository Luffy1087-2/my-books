import { TQueryInsert } from "../types/querys";

export default class QueryInsert {
  private readonly query: TQueryInsert;

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
    const fieldsString = this.query.fields.reduce((p: string, c: string) => p = p.concat(c, ', '), '').slice(0, -1);
    let select = 'INSERT INTO'
      .concat(' ', this.query.table)
      .concat(' ( ', fieldsString, ' )')
      .concat(' VALUES (', this.query.values.reduce((p: string, c: string) => p = p.concat('\'' + c + '\'', ', '), '').slice(0, -1), ' )')
      .concat(' RETURNING ', this.query.returning.reduce((p: string, c: string) => p = p.concat(c, ', '), '').slice(0, -1))
    return select;
  }

}