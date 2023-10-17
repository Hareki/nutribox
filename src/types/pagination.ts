export type PaginationMetadata = {
  currentPage: number;
  totalRecords: number;
  totalPages: number;
  perPage: number;
};

export interface PaginatedResponse<T> {
  data: T;
  metadata: PaginationMetadata;
}

// Old
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
