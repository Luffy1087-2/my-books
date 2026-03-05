import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from '@my-books/core';
import {Pool} from 'pg';

export default class Db {
  private static pool: Pool | undefined;

  public static connect() {
    this.pool = this.pool ?? this.createPool();
  }

  public static async query(query: string) {
    await this.pool?.query(query);
  }

  private static createPool(): Pool {
    return new Pool({
      host: DB_HOST,
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD,
      port: Number(DB_PORT)
    });
  }

}