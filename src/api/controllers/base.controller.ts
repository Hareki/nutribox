import { Model } from 'mongoose';

import {
  getAllDocs,
  GetManyDocsOptions,
  getOneDoc,
  GetOneDocsOptions,
} from 'api/base/mongoose/baseHandler';

export interface GetAllGeneratorOptions
  extends Omit<GetManyDocsOptions, 'model'> {}
export interface GetOneGeneratorOptions
  extends Omit<GetOneDocsOptions, 'model'> {}

export function getAllGenerator(model: Model<any>) {
  const getAll = async ({
    ...options
  }: GetAllGeneratorOptions): Promise<any[]> => {
    const allDocs = await getAllDocs({
      model,
      ...options,
    });
    return allDocs;
  };

  return getAll;
}

export function getOneGenerator(model: Model<any>) {
  const getOne = async ({ ...options }: GetOneGeneratorOptions) => {
    const oneDoc = await getOneDoc({
      model,
      ...options,
    });
    return oneDoc;
  };

  return getOne;
}
