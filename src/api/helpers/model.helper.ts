import { Document, Model } from 'mongoose';

import { CustomError, CustomErrorCodes } from './error.helper';

export const validateDocExistence = async (
  doc: Document,
  model: Model<any>,
  id: string,
) => {
  if (!doc) {
    throw new CustomError(
      `Document ${model.baseModelName} with id ${id} not found`,
      CustomErrorCodes.DOCUMENT_NOT_FOUND,
    );
  }
};
