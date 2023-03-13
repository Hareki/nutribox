import { Model, Types } from 'mongoose';

export interface BaseGetOptions {
  model: Model<any>;
  populate?: string[];
  lean?: boolean;
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
  const { populate, lean, ignoreFields, includeFields = [] } = options;
  if (populate) {
    query.populate(populate);
  }
  if (lean) {
    query.lean({ virtuals: true });
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

export const getAllDocs = async ({
  model,
  populate,
  lean = true,
  ignoreFields,
  includeFields,
  skip,
  limit,
}: GetManyDocsOptions): Promise<any[]> => {
  const query = model.find();

  buildBaseQuery(query, { populate, lean, ignoreFields, includeFields });

  if (skip) {
    query.skip(skip);
  }

  if (limit) {
    query.limit(limit);
  }

  const docs = await query.exec();
  return docs;
};

export const getOneDoc = async ({
  model,
  populate,
  lean = true,
  ignoreFields,
  includeFields,
  id,
}: GetOneDocsOptions): Promise<any> => {
  const query = model.findById(id);

  buildBaseQuery(query, { populate, lean, ignoreFields, includeFields });

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
