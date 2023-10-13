import type { DeepPartial, ObjectType } from 'typeorm';

import type { PaginationParams, SearchParams } from './pagination';

export interface GetRecordInputs<E> {
  entity: ObjectType<E>;
  relations?: (keyof E)[];
  filter?: DeepPartial<E> | DeepPartial<E>[];
  select?: (keyof E)[];
  order?: DeepPartial<E>;
}

export interface GetRecordsInputs<E> extends GetRecordInputs<E> {
  paginationParams: PaginationParams;
}

export interface GetRecordsByKeywordInputs<E> extends GetRecordInputs<E> {
  searchParams: SearchParams;
  getAll?: boolean;
}
