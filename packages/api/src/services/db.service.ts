import { Pool } from 'pg';
import { getEnvByKey } from '@my-books/core';

export default class DbService {
  private static pool: Pool | undefined;

  public static async query(query: string, values: any[] | undefined = undefined) {
    return await this.connect().query(query, values);
  }

  private static connect(): Pool {
    if (!DbService.pool) {
      DbService.pool = this.createPool();
    }
    return DbService.pool;
  }

  private static createPool(): Pool {
    return new Pool({
      host: getEnvByKey('DB_HOST'),
      database: getEnvByKey('DB_NAME'),
      user: getEnvByKey('DB_USER'),
      password: getEnvByKey('DB_PASSWORD'),
      port: Number(getEnvByKey('DB_PORT'))
    });
  }

}