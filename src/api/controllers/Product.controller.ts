import type { ClientSession } from 'mongoose';

import CustomerOrderController from './CustomerOrder.controller';
import {
  getAllGenerator,
  getOneGenerator,
  getTotalGenerator,
  updateOneGenerator,
} from './generator.controller';

import type {
  BaseGetOptions,
  GetManyDocsOptions,
} from 'api/base/mongoose/baseHandler';
import { buildBaseQuery } from 'api/base/mongoose/baseHandler';
import { populateAscUnexpiredExpiration } from 'api/helpers/model.helper';
import type { IConsumptionHistory } from 'api/models/CustomerOrder.model/CustomerOrderItem.schema/ConsumptionHistory.schema/types';
import type { ICustomerOrderItemInputWithoutConsumption } from 'api/models/CustomerOrder.model/CustomerOrderItem.schema/types';
import ExpirationModel from 'api/models/Expiration.model';
import ProductModel from 'api/models/Product.model';
import type { IProduct } from 'api/models/Product.model/types';
import { ProductCarouselLimit } from 'utils/constants';

interface GetNewProductsOptions extends Omit<BaseGetOptions, 'model'> {}

interface GetRelatedProductsParams {
  productId: string;
  categoryId: string;
}
interface GetRelatedProductOptions extends Omit<GetManyDocsOptions, 'model'> {}

const getAll = getAllGenerator<IProduct>(ProductModel());
const getOne = getOneGenerator<IProduct>(ProductModel());
const updateOne = updateOneGenerator<IProduct>(ProductModel());
const getTotal = getTotalGenerator(ProductModel());

const getHotProducts = async (): Promise<IProduct[]> => {
  const productsTotalSoldDesc =
    await CustomerOrderController.getProductIdsSortedByTotalSoldDesc();

  const promises = productsTotalSoldDesc.map(async (product) => {
    const productDetails = await ProductModel()
      .findById(product._id)
      .lean({ virtuals: true });
    return productDetails;
  });

  const rawHotProducts = await Promise.all(promises);
  const hotProducts = rawHotProducts
    .filter((product) => product.available)
    .slice(0, ProductCarouselLimit);

  return hotProducts;
};

const getRelatedProducts = async (
  { categoryId, productId }: GetRelatedProductsParams,
  { populate, ignoreFields, limit = 100 }: GetRelatedProductOptions,
): Promise<IProduct[]> => {
  const query = ProductModel().find({
    category: categoryId,
    available: true,
    _id: { $ne: productId },
  });
  query.limit(limit);
  buildBaseQuery(query, { populate, ignoreFields });

  const hotProducts = await query.exec();
  return hotProducts;
};

const getNewProducts = async (
  options?: GetNewProductsOptions,
): Promise<IProduct[]> => {
  const query = ProductModel()
    .find({ available: true })
    .limit(ProductCarouselLimit)
    .sort({ createdAt: -1, _id: 1 });

  buildBaseQuery(query, {
    populate: options?.populate,
    ignoreFields: options?.ignoreFields,
  });

  const relatedProducts = await query.exec();
  return relatedProducts;
};

async function consume(
  productId: string,
  quantityToSell: number,
  session: ClientSession,
): Promise<IConsumptionHistory[]> {
  const product: IProduct = await ProductModel().findById(productId);

  if (!product) {
    throw new Error(`Product ${productId} not found`);
  }

  const consumptionHistory: IConsumptionHistory[] = [];
  const populatedProduct = (await populateAscUnexpiredExpiration([product]))[0];
  const expirations = populatedProduct.expirations;

  const expirationsDocs = await ExpirationModel()
    .find({
      _id: { $in: expirations.map(({ id }) => id) },
    })
    .sort({ expirationDate: 1 })
    .exec();

  for (const expiration of expirationsDocs) {
    if (quantityToSell === 0) {
      break;
    }
    const consumedQuantity =
      expiration.quantity >= quantityToSell
        ? quantityToSell
        : expiration.quantity;

    if (expiration.quantity >= quantityToSell) {
      expiration.quantity -= quantityToSell;
      quantityToSell = 0;
    } else {
      quantityToSell -= expiration.quantity;
      expiration.quantity = 0;
    }
    await expiration.save({ session });

    if (consumedQuantity > 0) {
      consumptionHistory.push({
        id: expiration._id.toString(),
        expiration: expiration._id,
        quantity: consumedQuantity,
      });
    }
    console.log(
      `STILL HAVE SESSION AFTER SAVE OF EXPIRATION ID ${expiration._id}: `,
      !!session,
    );
  }

  if (quantityToSell > 0) {
    throw new Error(`Not enough product ${productId} available`);
  }

  return consumptionHistory;
}

const consumeProducts = async (
  items: ICustomerOrderItemInputWithoutConsumption[],
  session: ClientSession,
  // First dimension is the product, second dimension is the actual consumption history
): Promise<IConsumptionHistory[][]> => {
  const consumptionHistoriesPromises = items.map(async (item) => {
    return await consume(item.product.toString(), item.quantity, session);
  });

  const consumptionHistories = await Promise.all(consumptionHistoriesPromises);
  return consumptionHistories;
};

const ProductController = {
  getAll,
  getOne,
  updateOne,
  getTotal,
  getHotProducts,
  getRelatedProducts,
  getNewProducts,
  consumeProducts,
};
export default ProductController;
