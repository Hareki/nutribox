import type { NextApiRequest } from 'next';

import { sql } from 'api/database/mssql.config';
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

export type PaginationOutput = {
  TotalRecords: number;
  TotalPages: number;
  NextPageNumber: number;
};

type GetPaginationParamArray = {
  pageSize: number;
  pageNumber: number;
};
export function getPaginationParamArray({
  pageSize,
  pageNumber,
}: GetPaginationParamArray) {
  return [
    {
      name: 'PageSize',
      type: sql.Int,
      value: pageSize,
    },
    {
      name: 'PageNumber',
      type: sql.Int,
      value: pageNumber,
    },
    {
      name: 'TotalRecords',
      type: sql.Int,
      value: null,
      isOutput: true,
    },
    {
      name: 'TotalPages',
      type: sql.Int,
      value: null,
      isOutput: true,
    },
    {
      name: 'NextPageNumber',
      type: sql.Int,
      value: null,
      isOutput: true,
    },
  ];
}

export const extractPaginationOutputFromReq = (req: NextApiRequest) => {
  const { docsPerPage = '9999', page = '1' } = req.query;
  const pageSize = parseInt(docsPerPage as string, 10);
  const pageNumber = parseInt(page as string, 10);

  return { pageSize, pageNumber };
};
