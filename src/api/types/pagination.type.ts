export interface GetPaginationResult<T> {
  nextPageNum: number;
  totalDocs: number;
  docs: T[];
}

