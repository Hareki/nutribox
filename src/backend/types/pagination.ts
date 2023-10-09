export type PaginationParams = {
  page: number;
  limit: number;
};

export type SearchParams = {
  keyword: string;
  fieldName: string;
  limit: number;
};

export type SetPaginationHeaderInputs = {
  totalRecords: number;
} & PaginationParams;
