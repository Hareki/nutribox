import { ILike, type ObjectLiteral, type Repository } from 'typeorm';

import type {
  GetRecordInputs,
  GetRecordsByKeywordInputs,
  GetRecordsInputs,
} from 'backend/types/service';
import { getRepo } from 'backend/utils/database.helper';

export class CommonService {
  public static async getRecord<E extends ObjectLiteral>(
    input: GetRecordInputs<E>,
  ): Promise<E | undefined> {
    const { entity, filter, relations, select } = input;
    const repository: Repository<E> = await getRepo(entity);

    let queryBuilder = repository.createQueryBuilder(entity.name);

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
          `${entity.name}.${relation}`,
          relation,
        );
      }
    }

    if (filter) {
      queryBuilder = queryBuilder.where(filter);
    }

    if (select && select.length > 0) {
      queryBuilder = queryBuilder.select(
        select.map((field) => `${entity.name}.${String(field)}`),
      );
    }

    queryBuilder = queryBuilder.orderBy(`${entity.name}.createdAt`, 'DESC');
    queryBuilder = queryBuilder.take(1);

    return queryBuilder.getOne();
  }

  public static async getRecords<E extends ObjectLiteral>(
    input: GetRecordsInputs<E>,
  ): Promise<[E[], number]> {
    const {
      entity,
      paginationParams,
      filter,
      relations,
      select,
      getAll,
      order,
    } = input;
    const { limit, page } = paginationParams;
    const repository: Repository<E> = await getRepo(entity);

    let queryBuilder = repository.createQueryBuilder(entity.name);

    const entityMetadata = repository.metadata;

    // By default, load relation IDs for all relations
    for (const allRelationObjs of entityMetadata.relations) {
      if (!relations || !relations.includes(allRelationObjs.propertyName)) {
        queryBuilder = queryBuilder.loadRelationIdAndMap(
          `${entity.name}.${allRelationObjs.propertyName}`, // field name contains relation ID
          `${entity.name}.${allRelationObjs.propertyName}`, // reference to relation object
        );
      }
    }

    if (relations && relations.length > 0) {
      for (const relation of relations) {
        queryBuilder = queryBuilder.leftJoinAndSelect(
          `${entity.name}.${relation}`,
          relation,
        );
      }
    }

    const finalFilter = (filter || {}) as Record<string, any>;
    if (!getAll) {
      finalFilter.active = true;
    }

    if (finalFilter) {
      queryBuilder = queryBuilder.where(finalFilter);
    }

    if (select && select.length > 0) {
      queryBuilder = queryBuilder.select(
        select.map((field) => `${entity.name}.${String(field)}`),
      );
    }

    queryBuilder = queryBuilder.skip((page - 1) * limit);
    queryBuilder = queryBuilder.take(limit);
    queryBuilder = queryBuilder.orderBy(
      order || { [`${entity.name}.createdAt`]: 'DESC' },
    );

    const records = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return [records, totalRecords];
  }

  public static async getRecordsByKeyword<E extends ObjectLiteral>(
    input: GetRecordsByKeywordInputs<E>,
  ): Promise<E[]> {
    const { entity, searchParams, filter, relations, select, getAll, order } =
      input;

    const { keyword, fieldName, limit } = searchParams;
    const repository: Repository<E> = await getRepo(entity);

    let queryBuilder = repository.createQueryBuilder(entity.name);

    const entityMetadata = repository.metadata;

    // By default, load relation IDs for all relations
    for (const allRelationObjs of entityMetadata.relations) {
      if (!relations || !relations.includes(allRelationObjs.propertyName)) {
        queryBuilder = queryBuilder.loadRelationIdAndMap(
          `${entity.name}.${allRelationObjs.propertyName}Id`,
          `${entity.name}.${allRelationObjs.propertyName}`,
        );
      }
    }

    if (relations && relations.length > 0) {
      for (const relation of relations) {
        queryBuilder = queryBuilder.leftJoinAndSelect(
          `${entity.name}.${relation}`,
          relation,
        );
      }
    }

    if (Array.isArray(filter)) {
      queryBuilder = queryBuilder.where(
        filter.map((element) => ({
          ...element,
          [fieldName]: ILike(`%${keyword}%`),
        })),
      );
    } else {
      queryBuilder = queryBuilder.where({
        ...filter,
        [fieldName]: ILike(`%${keyword}%`),
      });
    }

    if (!getAll) {
      queryBuilder = queryBuilder.andWhere('active = :active', {
        active: true,
      });
    }

    if (select && select.length > 0) {
      queryBuilder = queryBuilder.select(
        select.map((field) => `${entity.name}.${String(field)}`),
      );
    }

    queryBuilder = queryBuilder.orderBy(
      order || { [`${entity.name}.createdAt`]: 'DESC' },
    );

    if (limit) {
      queryBuilder = queryBuilder.take(limit);
    }

    const records = await queryBuilder.getMany();

    return records;
  }
}
