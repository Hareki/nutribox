import { createOneGenerator } from './generator.controller';

import ProductOrderModel from 'api/models/ProductOrder.model';
import type { IProductOrder } from 'api/models/ProductOrder.model/types';

export const createOne = createOneGenerator<IProductOrder>(ProductOrderModel());

const ProductOrderController = {
  createOne,
};

export default ProductOrderController;
