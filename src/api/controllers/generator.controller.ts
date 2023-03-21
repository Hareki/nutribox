import type { Model } from 'mongoose';

import type {
  GetManyDocsOptions,
  GetOneDocsOptions } from 'api/base/mongoose/baseHandler';
import {
  createOneDoc,
  getAllDocs,
  getOneDoc,
} from 'api/base/mongoose/baseHandler';

export interface GetAllGeneratorOptions
  extends Omit<GetManyDocsOptions, 'model'> {}
export interface GetOneGeneratorOptions
  extends Omit<GetOneDocsOptions, 'model'> {}

export function getAllGenerator<T>(model: Model<any>) {
  const getAll = async (options?: GetAllGeneratorOptions): Promise<T[]> => {
    const allDocs: T[] = await getAllDocs({
      model,
      ...options,
    });
    return allDocs;
  };

  return getAll;
}

export function getOneGenerator<T>(model: Model<any>) {
  const getOne = async (options?: GetOneGeneratorOptions) => {
    const oneDoc: T = await getOneDoc({
      model,
      ...options,
    });
    return oneDoc;
  };

  return getOne;
}

export function getTotalGenerator(model: Model<any>) {
  const getTotal = async () => {
    const total = await model.countDocuments().exec();
    return total;
  };

  return getTotal;
}

export function createOneGenerator<T>(model: Model<any>) {
  const createOne = async (data: any) => {
    const newDoc: T = await createOneDoc(model, data);
    return newDoc;
  };

  return createOne;
}

export function updateOneGenerator<T>(model: Model<any>) {
  const updateOne = async (id: string, data: any) => {
    const updatedDoc: T = await model.findByIdAndUpdate(id, data, {
      new: true,
    });
    return updatedDoc;
  };

  return updateOne;
}