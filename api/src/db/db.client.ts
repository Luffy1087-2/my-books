import {Pool} from 'pg';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from '@my-books/core';

export default class DbClient {
  private static pool: Pool | undefined;

  public static connect() {
    this.pool = this.pool ?? this.createPool();

    return DbClient;
  }

  public static async query(query: string) {
    return await this.pool?.query(query);
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