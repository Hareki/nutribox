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
