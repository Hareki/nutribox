import type { NextApiRequest } from 'next';

import { sql } from 'api/database/mssql.config';
import { poolPromise } from 'api/database/mssql.config';
import { AdminMainTablePaginationConstant } from 'utils/constants';

type ProcedureParam = {
  name: string;
  type: sql.ISqlTypeFactoryWithNoParams;
  value: any;
  isOutput?: boolean;
};

export async function executeUsp<T1 = unknown, T2 = unknown>(
  procedure: string,
  params: ProcedureParam[] = [],
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

type GetProductInputArray = {
  category: string;
  name: string;
  available: boolean;
  wholesalePrice: number;
  retailPrice: number;
  shelfLife: number;
  description: string;
};
export function getProductInputArray(requestBody: GetProductInputArray) {
  return [
    {
      name: 'CategoryId',
      type: sql.UniqueIdentifier,
      value: requestBody.category,
    },
    {
      name: 'Name',
      type: sql.NVarChar,
      value: requestBody.name,
    },
    {
      name: 'Available',
      type: sql.Bit,
      value: requestBody.available ? 1 : 0,
    },
    {
      name: 'ImportPrice',
      type: sql.Int,
      value: requestBody.wholesalePrice,
    },
    {
      name: 'RetailPrice',
      type: sql.Int,
      value: requestBody.retailPrice,
    },
    {
      name: 'ShelfLife',
      type: sql.Int,
      value: requestBody.shelfLife,
    },
    {
      name: 'Description',
      type: sql.NVarChar,
      value: requestBody.description,
    },
  ];
}

type RequestBodyAddress = {
  provinceId: number;
  districtId: number;
  wardId: number;
  streetAddress: string;
};

export const getAddressParamArray = (requestBody: RequestBodyAddress) => [
  {
    name: 'ProvinceCode',
    type: sql.Int,
    value: requestBody.provinceId,
  },
  {
    name: 'DistrictCode',
    type: sql.Int,
    value: requestBody.districtId,
  },
  {
    name: 'WardCode',
    type: sql.Int,
    value: requestBody.wardId,
  },
  {
    name: 'StreetAddress',
    type: sql.NVarChar,
    value: requestBody.streetAddress,
  },
];

export const extractPaginationOutputFromReq = (req: NextApiRequest) => {
  const { docsPerPage = '9999', page = '1' } = req.query;
  const pageSize = parseInt(docsPerPage as string, 10);
  const pageNumber = parseInt(page as string, 10);

  return { pageSize, pageNumber };
};

type FetchAdminPaginationData = {
  procedureName: string;
  pageNumber: number;
  pageSize: number;
};

export const fetchAdminPaginationData = async <T>(
  { procedureName, pageNumber, pageSize }: FetchAdminPaginationData,
  additionalParams: ProcedureParam[] = [],
) => {
  const queryResult = await executeUsp<T, PaginationOutput>(procedureName, [
    ...additionalParams,
    ...getPaginationParamArray({
      pageNumber,
      pageSize,
    }),
  ]);

  const data = queryResult.data;
  const result = {
    totalPages: queryResult.output.TotalPages,
    totalDocs: queryResult.output.TotalRecords,
    docs: data,
  };

  return result;
};

type FetchAdminSearchData = {
  procedureName: string;
  keyword: string;
};
export const fetchAdminSearchData = async <T>({
  procedureName,
  keyword,
}: FetchAdminSearchData) => {
  const result = (
    await executeUsp<T>(procedureName, [
      {
        name: 'Keyword',
        type: sql.NVarChar,
        value: keyword,
      },
      {
        name: 'Limit',
        type: sql.Int,
        value: AdminMainTablePaginationConstant.docsPerPage,
      },
    ])
  ).data;

  return result;
};
