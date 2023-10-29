import type { QueryFunction } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { ChangeEvent } from 'react';
import { useMemo, useState } from 'react';
import { useDebounce } from 'usehooks-ts';

import type { GetAllPaginationResult } from 'types/pagination';

type MapItemToRow = (item: any) => any;

interface UseTableSearch {
  queryFn: QueryFunction<any, string[]>;
  paginationResult?: GetAllPaginationResult<any>;
  mapItemToRow: MapItemToRow;
}
export function useTableSearch({
  queryFn,
  paginationResult,
  mapItemToRow,
}: UseTableSearch) {
  const [searchQuery, setSearchQuery] = useState('');
  const debounceSearchQuery = useDebounce(searchQuery, 200);

  const { data: searchResult, isFetching: isSearching } = useQuery({
    queryKey: ['products', 'search', debounceSearchQuery],
    queryFn,
    initialData: [],
  });

  const filteredList = useMemo(() => {
    if (!debounceSearchQuery) {
      return paginationResult?.docs.map(mapItemToRow);
    }
    return searchResult?.map(mapItemToRow);
  }, [debounceSearchQuery, searchResult, mapItemToRow, paginationResult?.docs]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  return { handleSearch, filteredList, searchQuery, isSearching };
}
