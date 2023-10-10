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

    const commonOptions = {
      where: filter,
      take: 1,
      select,
      order: {
        createdAt: 'DESC',
      } as any,
    };

    const recordsWithIds = await repository.find({
      loadRelationIds: true,
      ...commonOptions,
    });

    if (!relations || relations.length === 0) {
      return recordsWithIds[0];
    }

    const recordsWithRelations = await repository.find({
      relations,
      ...commonOptions,
    });

    // Merge the two records
    const mergedRecord: E = {
      ...recordsWithIds[0],
      ...recordsWithRelations[0],
    };

    return mergedRecord;
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

    const finalFilter = (filter || {}) as Record<string, any>;
    if (!getAll) {
      finalFilter.active = true;
    }

    const commonOptions = {
      where: finalFilter,
      skip: (page - 1) * limit,
      take: limit,
      select,
      order: order || ({ createdAt: 'DESC' } as any),
    };

    // Initial query with loadRelationIds
    const [recordsWithIds, totalRecords] = await repository.findAndCount({
      loadRelationIds: true,
      ...commonOptions,
    });

    if (!relations || relations.length === 0) {
      return [recordsWithIds, totalRecords];
    }

    // Now, find records with actual relations to populate the relation objects
    const recordsWithRelations = await repository.find({
      relations,
      ...commonOptions,
    });

    // Merge the two record lists. Since we're working with arrays here, you might want to map and spread.
    const mergedRecords = recordsWithIds.map((record, index) => ({
      ...record,
      ...recordsWithRelations[index],
    }));

    return [mergedRecords, totalRecords];
  }

  public static async getRecordsByKeyword<E extends ObjectLiteral>(
    input: GetRecordsByKeywordInputs<E>,
  ): Promise<E[]> {
    const { entity, searchParams, filter, relations, select, getAll, order } =
      input;
    const { keyword, fieldName, limit } = searchParams;
    const repository: Repository<E> = await getRepo(entity);

    let finalWhere: any;
    if (Array.isArray(filter)) {
      finalWhere = filter.map((element) => {
        const result: Record<string, any> = {
          ...element,
          [fieldName]: ILike(`%${keyword}%`),
        };
        if (!getAll) {
          result.active = true;
        }
        return result;
      });
    } else {
      finalWhere = {
        ...filter,
        [fieldName]: ILike(`%${keyword}%`),
      };
      if (!getAll) {
        finalWhere.active = true;
      }
    }

    const commonOptions = {
      where: finalWhere,
      take: limit,
      select,
      order: order || ({ createdAt: 'DESC' } as any),
    };

    const records: E[] = await repository.find({
      ...commonOptions,
      relations,
    });

    return records;
  }
}
