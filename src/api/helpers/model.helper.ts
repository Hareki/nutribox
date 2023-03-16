import { Document, Model, Types } from 'mongoose';

import { CustomError, CustomErrorCodes } from './error.helper';

import {
  ICartItem,
  IPopulatedCartItem,
} from 'api/models/Account.model/CartItem.schema/types';
import Product from 'api/models/Product.model';
import { IProduct } from 'api/models/Product.model/types';

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
  const products: IProduct[] = await Product.find({
    _id: { $in: productIds },
  })
    .lean({ virtuals: true })
    .exec();

  const cartItems: IPopulatedCartItem[] = cartItemsDoc.map((cartItem) => {
    const product = products.find((p) => p._id.equals(cartItem.product));
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
