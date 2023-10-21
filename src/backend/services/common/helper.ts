import type {
  DeepPartial,
  ObjectLiteral,
  ObjectType,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import type { PaginationParams, SearchParams } from '../../types/pagination';

import type { AbstractEntity } from 'backend/entities/abstract.entity';
import { toTableName } from 'utils/string.helper';

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

const exceptionRelationFieldNames = [
  {
    from: 'default_supplier',
    to: 'supplier',
  },
];

export const buildChildRelationIds = <E extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<E>,
  repository: Repository<E>,
  relation: keyof E,
) => {
  // Load relation IDs for child entities (new code)
  let childEntityName = toTableName(String(relation));

  const exceptionRelationFieldName = exceptionRelationFieldNames.find(
    (item) => item.from === childEntityName,
  );
  if (exceptionRelationFieldName) {
    childEntityName = exceptionRelationFieldName.to;
  }
  const childEntityMetadata =
    repository.manager.connection.getMetadata(childEntityName);
  for (const grandChildRelation of childEntityMetadata.relations) {
    queryBuilder = queryBuilder.loadRelationIdAndMap(
      `${String(relation)}.${grandChildRelation.propertyName}`,
      `${String(relation)}.${grandChildRelation.propertyName}`,
    );
  }
};

export const buildRelationFields = <E extends ObjectLiteral>(
  entity: ObjectType<E>,
  queryBuilder: SelectQueryBuilder<E>,
  repository: Repository<E>,
  relations: (keyof E)[] | undefined,
) => {
  // By default, load relation IDs for all relations
  const entityMetadata = repository.metadata;
  for (const allRelationObjs of entityMetadata.relations) {
    if (!relations || !relations.includes(allRelationObjs.propertyName)) {
      queryBuilder = queryBuilder.loadRelationIdAndMap(
        `${entity.name}.${allRelationObjs.propertyName}`,
        `${entity.name}.${allRelationObjs.propertyName}`,
      );
    }
  }

  if (relations && relations.length > 0) {
    for (const relation of relations) {
      queryBuilder = queryBuilder.leftJoinAndSelect(
        `${entity.name}.${String(relation)}`,
        String(relation),
      );
      buildChildRelationIds(queryBuilder, repository, relation);
    }
  }
};
