import { Pagination } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';

import type { GetAllPaginationResult } from 'api/types/pagination.type';

interface UsePaginationQueryParams {
  baseQueryKey: (string | number)[];
  getPaginationDataFn: (currPageNum: number, otherArgs: any) => Promise<any>;
  otherArgs?: any;
}
const usePaginationQuery = <T,>({
  baseQueryKey,
  getPaginationDataFn,
  otherArgs,
}: UsePaginationQueryParams) => {
  const router = useRouter();
  const initialPageStr = router.query.p as string;
  const initialPageNum = parseInt(initialPageStr);

  const [currPageNum, setCurrPageNum] = useState(initialPageNum || 1);

  const {
    data: paginationData,
    isLoading,
    isFetching,
  } = useQuery<GetAllPaginationResult<T>>({
    queryKey: [...baseQueryKey, currPageNum],
    queryFn: () => getPaginationDataFn(currPageNum, otherArgs),
    keepPreviousData: true,
  });

  const paginationComponent = (
    <Pagination
      count={paginationData?.totalPages || 1}
      color='primary'
      variant='outlined'
      onChange={(_, value) => setCurrPageNum(value)}
      defaultPage={currPageNum}
    />
  );

  return {
    isLoading,
    paginationData,
    paginationComponent,
  };
};
export default usePaginationQuery;
