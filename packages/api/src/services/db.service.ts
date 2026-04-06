import { Pool } from 'pg';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from '@my-books/core';

export default class DbService {
  private static pool: Pool | undefined;

  public static async query(query: string, values: any[] | undefined = undefined) {
    return await this.connect().query(query, values);
  }

  private static connect(): Pool {
    return this.pool ?? this.createPool();
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