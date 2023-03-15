export interface GetPaginationResult<T> {
  nextPageNum: number;
  totalDocs: number;
  docs: T[];
}

export interface GetPaginationPrerenderResult<T> {
  pages: GetPaginationResult<T>[];
  pageParams: number[];
}
