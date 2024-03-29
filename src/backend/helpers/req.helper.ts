import type { NextApiRequest, NextApiResponse } from 'next';

import type {
  PaginationParams,
  SetPaginationHeaderInputs,
} from 'backend/types/pagination';
import {
  DEFAULT_DOCS_PER_PAGE,
  DEFAULT_PAGE,
} from 'constants/pagination.constant';

export const getPaginationParams = (req: NextApiRequest): PaginationParams => {
  const page: number = Number(req.query.page) || DEFAULT_PAGE;
  const limit: number = Number(req.query.limit) || DEFAULT_DOCS_PER_PAGE;

  return { page, limit };
};

export const setPaginationHeader = (
  res: NextApiResponse,
  { totalRecords, limit, page }: SetPaginationHeaderInputs,
): void => {
  const totalPages = Math.ceil(totalRecords / limit);
  const nextPageNum = page < totalPages ? page + 1 : -1;

  res.setHeader('X-Total-Count', totalRecords);
  res.setHeader('X-Total-Pages', totalPages);
  res.setHeader('X-Current-Page', page);
  res.setHeader('X-Per-Page', limit);
  res.setHeader('X-Next-Page', nextPageNum);
};

export const getArrayQuery = (
  req: NextApiRequest,
  queryName: string,
): string[] => {
  const finalQueryName = `${queryName}[]`;
  const result =
    typeof req.query[finalQueryName] === 'string'
      ? [req.query[finalQueryName]]
      : req.query[finalQueryName];

  return result as string[];
};
