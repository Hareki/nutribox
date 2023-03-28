import { createOneGenerator } from './generator.controller';

import ExpirationModel from 'api/models/Expiration.model';
import type { IExpiration } from 'api/models/Expiration.model/types';

export const createOne = createOneGenerator<IExpiration>(ExpirationModel());

const getExpirationsByProductId = async (
  productId: string,
): Promise<IExpiration[]> => {
  try {
    const expirations = await ExpirationModel()
      .find({ product: productId })
      .lean({ virtuals: true })
      .exec();
    return expirations;
  } catch (error) {
    console.error('Error fetching expirations:', error);
    return [];
  }
};

const ExpirationController = {
  getExpirationsByProductId,
  createOne,
};
export default ExpirationController;
