import type { Document, Model, Types } from 'mongoose';

import { CustomError, CustomErrorCodes } from './error.helper';

import type {
  ICartItem,
  IPopulatedCartItem,
} from 'api/models/Account.model/CartItem.schema/types';
import ExpirationModel from 'api/models/Expiration.model';
import type { IExpiration } from 'api/models/Expiration.model/types';
import ProductModel from 'api/models/Product.model';
import type { IProduct, IUpeProduct } from 'api/models/Product.model/types';

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

export const populateCartItems = async (
  cartItemsDoc: ICartItem[],
): Promise<IPopulatedCartItem[]> => {
  const productIds: Types.ObjectId[] = cartItemsDoc.map(
    (cartItem) => cartItem.product,
  );
  const products: IProduct[] = await ProductModel()
    .find({
      _id: { $in: productIds },
    })
    .lean({ virtuals: true })
    .exec();

  const upeProducts = await populateUnexpiredExpiration(products);

  const cartItems: IPopulatedCartItem[] = cartItemsDoc.map((cartItem) => {
    const product = upeProducts.find(
      (p) => p.id === cartItem.product.toString(),
    );
    if (!product) {
      throw new CustomError(
        `Product not found for cart item: ${cartItem.id}`,
        CustomErrorCodes.PRODUCT_NOT_BELONG_TO_CART_ITEM,
      );
    }

    return {
      id: cartItem.id,
      product,
      quantity: cartItem.quantity,
    } as IPopulatedCartItem;
  });

  return cartItems;
};

export const populateUnexpiredExpiration = async (
  products: IProduct[],
): Promise<IUpeProduct[]> => {
  const getUnexpiredExpirations = async (
    productId: string,
  ): Promise<IExpiration[]> => {
    try {
      const unexpiredExpirations = await ExpirationModel()
        .find({
          product: productId,
          expirationDate: { $gt: new Date() },
        })
        .lean()
        .exec();

      return unexpiredExpirations;
    } catch (error) {
      console.error('Error retrieving unexpired Expirations:', error);
      return null;
    }
  };

  const promises = products.map(async (product) => {
    const expirations = await getUnexpiredExpirations(product.id);
    return { ...product, expirations };
  });

  const populatedProducts: IUpeProduct[] = await Promise.all(promises);
  console.log(
    'file: model.helper.ts:91 - populatedProducts:',
    populatedProducts,
  );

  return populatedProducts;
};
