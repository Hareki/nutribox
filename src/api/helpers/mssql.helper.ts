import type { sql } from 'api/database/mssql.config';
import { poolPromise } from 'api/database/mssql.config';

type procedureParam = {
  name: string;
  type: sql.ISqlTypeFactoryWithNoParams;
  value: any;
  isOutput?: boolean;
};

export async function executeUsp<T1 = unknown, T2 = unknown>(
  procedure: string,
  params: procedureParam[] = [],
) {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    for (const param of params) {
      const { name, type, value, isOutput } = param;
      if (isOutput) {
        request.output(name, type, value);
      } else {
        request.input(name, type, value);
      }
    }

    const result = await request.execute(procedure);
    return {
      data: result.recordset as T1[],
      output: result.output as T2,
    };
  } catch (error) {
    console.error(`Error executing stored procedure ${procedure}:`, error);
    throw error;
  }
}
