import { Model } from 'mongoose';

import {
  getAllDocs,
  GetAllDocsOptions,
  getOneDoc,
  GetOneDocsOptions,
} from 'api/base/mongoose/baseHandler';

interface GetAllGeneratorOptions extends Omit<GetAllDocsOptions, 'model'> {}
interface GetOneGeneratorOptions extends Omit<GetOneDocsOptions, 'model'> {}

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
