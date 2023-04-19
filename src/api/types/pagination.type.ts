export interface GetInfinitePaginationResult<T> {
  nextPageNum: number;
  totalDocs: number;
  docs: T[];
}

export interface GetAllPaginationResult<T> {
  totalDocs: number;
  totalPages: number;
  docs: T[];
}

export interface GetAllPaginationParams {
  skip: number;
  limit: number;
}

export interface GetAllDependentPaginationParams
  extends GetAllPaginationParams {
  id: string;
}

// ============

export interface UspPaginationOutput {
  TotalRecords: number;
  TotalPages: number;
}

export interface UspInfinitePaginationOutput {
  TotalRecords: number;
  NextPageNumber: number;
}
