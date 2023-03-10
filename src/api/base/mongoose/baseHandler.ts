import { Model, Types } from 'mongoose';

import connectToDB from 'api/database/databaseConnection';

export interface BaseGetOptions {
  model: Model<any>;
  populate?: string[];
  lean?: boolean;
  ignoreFields?: string[];
}

export interface GetAllDocsOptions extends BaseGetOptions {
  skip?: number;
  limit?: number;
}
export interface GetOneDocsOptions extends BaseGetOptions {
  id: Types.ObjectId | string;
}

export const getAllDocs = async ({
  model,
  populate = [],
  lean = true,
  skip,
  limit,
  ignoreFields = [],
}: GetAllDocsOptions): Promise<any[]> => {
  const query = model
    .find()
    .select(ignoreFields.map((field) => `-${field}`).join(' '))
    .populate(populate);

  if (skip) {
    query.skip(skip);
  }

  if (limit) {
    query.limit(limit);
  }

  if (lean) {
    query.lean({ virtuals: true });
  }

  const docs = await query.exec();
  return docs;
};

export const getOneDoc = async ({
  id,
  model,
  populate = [],
  lean = true,
  ignoreFields = [],
}: GetOneDocsOptions): Promise<any> => {
  const query = model
    .findById(id)
    .select(ignoreFields.map((field) => `-${field}`).join(' '))
    .populate(populate);

  if (lean) {
    query.lean({ virtuals: true });
  }

  const doc = await query.exec();
  if (!doc) {
    throw new Error(`Document ${model.baseModelName} with id ${id} not found`);
  }
  return doc;
};

export const createOneDoc = async (
  model: Model<any>,
  data: any,
): Promise<any> => {
  const doc = await model.create(data);
  return doc;
};
