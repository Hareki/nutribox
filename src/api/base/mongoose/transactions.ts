import mongoose from 'mongoose';

import ExpirationModel from 'api/models/Expiration.model';
import type {
  IExpiration,
  IExpirationInput,
} from 'api/models/Expiration.model/types';
import ProductModel from 'api/models/Product.model';
import type { IProduct, IProductInput } from 'api/models/Product.model/types';
import ProductCategoryModel from 'api/models/ProductCategory.model';

async function transactionWrapper<T>(
  callback: (session: mongoose.ClientSession) => Promise<T>,
) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const result = await callback(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
}

export async function createProductTrans(
  productData: IProductInput,
): Promise<IProduct> {
  return transactionWrapper<IProduct>(async (session) => {
    const ProductModelVar = ProductModel();
    const product = new ProductModelVar(productData);
    const savedProduct = await product.save({ session });

    const category = await ProductCategoryModel().findById(
      savedProduct.category,
    );
    if (!category) {
      throw new Error('Referenced Category not found');
    }

    product.expirations.push(savedProduct._id);
    await product.save({ session });

    return savedProduct;
  });
}

export async function createExpirationTrans(
  expirationData: IExpirationInput,
): Promise<IExpiration> {
  return transactionWrapper<IExpiration>(async (session) => {
    const ExpirationModelVar = ExpirationModel();
    const expiration = new ExpirationModelVar(expirationData);
    const savedExpiration = await expiration.save({ session });

    const product = await ProductModel().findById(savedExpiration.product);
    if (!product) {
      throw new Error('Referenced Product not found');
    }

    product.expirations.push(savedExpiration._id);
    await product.save({ session });

    return savedExpiration;
  });
}
