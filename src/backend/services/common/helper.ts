import type { DeepPartial, ObjectType } from 'typeorm';

import type { PaginationParams, SearchParams } from '../../types/pagination';

import type { AbstractEntity } from 'backend/entities/abstract.entity';

export interface GetRecordInputs<E> {
  entity: ObjectType<E>;
  relations?: (keyof E)[];
  // filter?: DeepPartial<E> | DeepPartial<E>[];
  filter?:
    | Partial<Record<keyof E, any>>
    | Partial<Record<keyof E, any>>[]
    | DeepPartial<E>
    | DeepPartial<E>[];
  select?: (keyof E)[];
  order?: DeepPartial<E>;
}

export interface GetRecordsInputs<E> extends GetRecordInputs<E> {
  paginationParams?: PaginationParams;
  whereInIds?: string[];
}

export interface GetRecordsByKeywordInputs<E> extends GetRecordInputs<E> {
  searchParams: SearchParams;
  getAll?: boolean;
}

export type CommonArgs<T extends AbstractEntity> = Partial<
  GetRecordsInputs<T>
> & {
  entity: new (...args: any[]) => T;
};

export const prefixObjectKeys = (
  obj: Record<string, any>,
  prefix: string,
): Record<string, any> => {
  const prefixedObject: Record<string, any> = {};

  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      prefixedObject[`${prefix}.${key}`] = obj[key];
    }
  }

  return prefixedObject;
};
