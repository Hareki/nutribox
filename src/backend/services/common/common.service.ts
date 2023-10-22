import type { DeepPartial, ObjectType } from 'typeorm';
import {
  EntityNotFoundError,
  ILike,
  type ObjectLiteral,
  type Repository,
} from 'typeorm';

import { getRepo } from 'backend/helpers/database.helper';
import {
  prefixObjectKeys,
  type GetRecordInputs,
  type GetRecordsByKeywordInputs,
  type GetRecordsInputs,
  buildRelationFields,
} from 'backend/services/common/helper';

export class CommonService {
  public static async getRecord<E extends ObjectLiteral>(
    input: GetRecordInputs<E>,
    transactionRepo?: Repository<E>,
  ): Promise<E> {
    const { entity, filter, relations, select } = input;
    const repository: Repository<E> =
      transactionRepo || (await getRepo(entity));

    let queryBuilder = repository.createQueryBuilder(entity.name);

    buildRelationFields(entity, queryBuilder, repository, relations);

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
    transactionRepo?: Repository<E>,
  ): Promise<[E[], number, number, number]> {
    const {
      entity,
      paginationParams,
      filter,
      relations,
      select,
      order,
      whereInIds,
    } = input;
    const { limit, page } = paginationParams || {
      limit: Number.MAX_SAFE_INTEGER,
      page: 1,
    };

    const repository: Repository<E> =
      transactionRepo || (await getRepo(entity));

    let queryBuilder = repository.createQueryBuilder(entity.name);

    buildRelationFields(entity, queryBuilder, repository, relations);

    const finalFilter = (filter || {}) as Record<string, any>;

    if (finalFilter) {
      queryBuilder = queryBuilder.where(finalFilter);
    }

    if (whereInIds) {
      queryBuilder = queryBuilder.whereInIds(whereInIds);
    }

    if (select && select.length > 0) {
      queryBuilder = queryBuilder.select(
        select.map((field) => `${entity.name}.${String(field)}`),
      );
    }

    const orderBy = order
      ? prefixObjectKeys(order, entity.name)
      : {
          [`${entity.name}.createdAt`]: 'DESC',
        };

    queryBuilder = queryBuilder.skip((page - 1) * limit);
    queryBuilder = queryBuilder.take(limit);
    queryBuilder = queryBuilder.orderBy(orderBy);

    const records = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    const totalPages = Math.ceil(totalRecords / limit);
    const nextPageNum = page < totalPages ? page + 1 : -1;

    return [records, totalRecords, nextPageNum, totalPages];
  }

  public static async getRecordsByKeyword<E extends ObjectLiteral>(
    input: GetRecordsByKeywordInputs<E>,
    transactionRepo?: Repository<E>,
  ): Promise<E[]> {
    const { entity, searchParams, filter, relations, select, order } = input;

    const { keyword, fieldName, limit } = searchParams;
    const repository: Repository<E> =
      transactionRepo || (await getRepo(entity));

    let queryBuilder = repository.createQueryBuilder(entity.name);

    buildRelationFields(entity, queryBuilder, repository, relations);

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

    const orderBy = order
      ? prefixObjectKeys(order, entity.name)
      : {
          [`${entity.name}.createdAt`]: 'DESC',
        };

    queryBuilder = queryBuilder.orderBy(orderBy);

    if (limit) {
      queryBuilder = queryBuilder.take(limit);
    }

    const records = await queryBuilder.getMany();

    return records;
  }

  public static async createRecord<E extends ObjectLiteral>(
    entity: ObjectType<E>,
    data: DeepPartial<E>,
    transactionRepo?: Repository<E>,
  ): Promise<E> {
    const repository: Repository<E> =
      transactionRepo || (await getRepo(entity));
    const entityInstance = repository.create(data);
    const record = await repository.save(entityInstance as DeepPartial<E>);
    return record;
  }

  public static async updateRecord<E extends ObjectLiteral>(
    entity: ObjectType<E>,
    id: number | string,
    data: DeepPartial<E>,
    transactionRepo?: Repository<E>,
  ): Promise<E> {
    const repository: Repository<E> =
      transactionRepo || (await getRepo(entity));
    const existingRecord = await repository.findOneOrFail(id);

    const updatedRecord = repository.merge(existingRecord, data);
    const subject = await repository.save(updatedRecord as DeepPartial<E>);

    return subject;
  }

  public static async deleteRecord<E extends ObjectLiteral>(
    entity: ObjectType<E>,
    id: number | string,
    transactionRepo?: Repository<E>,
  ): Promise<boolean> {
    const repository: Repository<E> =
      transactionRepo || (await getRepo(entity));
    const existingRecord = await repository.findOneOrFail(id);

    await repository.remove(existingRecord);
    return true;
  }
}
