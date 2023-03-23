import type { ClientSession, Model, Types } from 'mongoose';

export interface BaseGetOptions {
  model: Model<any>;
  populate?: string[];
  ignoreFields?: string[];
  includeFields?: string[];
}

export interface BaseQueryBuilderOptions
  extends Omit<BaseGetOptions, 'model'> {}

export interface GetManyDocsOptions extends BaseGetOptions {
  skip?: number;
  limit?: number;
}
export interface GetOneDocsOptions extends BaseGetOptions {
  id: Types.ObjectId | string;
}

export const buildBaseQuery = (
  query: any,
  options: BaseQueryBuilderOptions,
) => {
  const { populate, ignoreFields, includeFields = [] } = options;
  query.lean({ virtuals: true });
  if (populate) {
    query.populate(populate);
  }
  let ignoreFieldsArr = ['__v'];
  if (ignoreFields) {
    ignoreFieldsArr = ['__v', ...ignoreFields];
  }

  let querySelector = `-${ignoreFieldsArr.join(' -')}`;
  if (includeFields.length > 0) {
    querySelector = includeFields.join(' ');
  }

  query.select(querySelector);
};

// With lean, processed data
export const getAllDocs = async ({
  model,
  populate,
  ignoreFields,
  includeFields,
  skip,
  limit,
}: GetManyDocsOptions): Promise<any[]> => {
  const query = model.find();

  buildBaseQuery(query, { populate, ignoreFields, includeFields });

  if (skip) {
    query.skip(skip);
  }

  if (limit) {
    query.limit(limit);
  }

  const docs = await query.exec();
  return docs;
};

// With lean, processed data
export const getOneDoc = async ({
  model,
  populate,
  ignoreFields,
  includeFields,
  id,
}: GetOneDocsOptions): Promise<any> => {
  const query = model.findById(id);

  buildBaseQuery(query, { populate, ignoreFields, includeFields });

  const doc = await query.exec();
  if (!doc) {
    throw new Error(`Document ${model.baseModelName} with id ${id} not found`);
  }
  return doc;
};

export const createOneDoc = async (
  model: Model<any>,
  data: any,
  session?: ClientSession,
): Promise<any[]> => {
  if (session) {
    // must pass data as an array when using session, so the returned value will also be an array
    const doc = await model.create([data], { session });
    return doc;
  } else {
    const doc = await model.create([data]);
    return doc;
  }
};
