import type { DeepPartial, ObjectType } from 'typeorm';
import {
  EntityNotFoundError,
  ILike,
  type ObjectLiteral,
  type Repository,
} from 'typeorm';

import type {
  GetRecordInputs,
  GetRecordsByKeywordInputs,
  GetRecordsInputs,
} from 'backend/types/service';
import { getRepo } from 'backend/utils/database.helper';

export class CommonService {
  public static async getRecord<E extends ObjectLiteral>(
    input: GetRecordInputs<E>,
  ): Promise<E> {
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
          `${entity.name}.${String(relation)}`,
          String(relation),
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

    const result = await queryBuilder.getOne();

    if (!result) {
      throw new EntityNotFoundError(entity, filter);
    }

    return result;
  }

  public static async getRecords<E extends ObjectLiteral>(
    input: GetRecordsInputs<E>,
  ): Promise<[E[], number]> {
    const { entity, paginationParams, filter, relations, select, order } =
      input;
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
          `${entity.name}.${String(relation)}`,
          String(relation),
        );
      }
    }

    const finalFilter = (filter || {}) as Record<string, any>;

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
    const { entity, searchParams, filter, relations, select, order } = input;

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
          `${entity.name}.${String(relation)}`,
          String(relation),
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

  public static async createRecord<E extends ObjectLiteral>(
    entity: ObjectType<E>,
    data: DeepPartial<E>,
  ): Promise<E> {
    const repository: Repository<E> = await getRepo(entity);
    const entityInstance = repository.create(data);
    const record = await repository.save(entityInstance as DeepPartial<E>);
    return record;
  }

  public static async updateRecord<E extends ObjectLiteral>(
    entity: ObjectType<E>,
    id: number | string,
    data: DeepPartial<E>,
  ): Promise<E> {
    const repository: Repository<E> = await getRepo(entity);
    const existingRecord = await repository.findOneOrFail(id);

    const updatedRecord = repository.merge(existingRecord, data);
    const subject = await repository.save(updatedRecord as DeepPartial<E>);

    return subject;
  }

  public static async deleteRecord<E extends ObjectLiteral>(
    entity: ObjectType<E>,
    id: number | string,
  ): Promise<boolean> {
    const repository: Repository<E> = await getRepo(entity);
    const existingRecord = await repository.findOneOrFail(id);

    await repository.remove(existingRecord);
    return true;
  }
}
