import type { AxiosResponse } from 'axios';

import type { JSSuccess } from 'backend/types/jsend';
import type { GetAllPaginationResult } from 'types/pagination';

export const convertToPaginationResult = <T>(
  axiosResponse: AxiosResponse<JSSuccess<T[]>, any>,
): GetAllPaginationResult<T> => {
  return {
    docs: axiosResponse.data.data,
    totalDocs: axiosResponse.headers['x-total-count'],
    totalPages: axiosResponse.headers['x-total-pages'],
  };
};
