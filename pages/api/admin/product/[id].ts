import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import {
  defaultOnNoMatch,
  onMongooseValidationError,
} from 'api/base/next-connect';
import ProductController from 'api/controllers/Product.controller';
import connectToDB from 'api/database/databaseConnection';
import type {
  IPopulatedCategoryProduct,
  IProduct,
} from 'api/models/Product.model/types';
import ProductCategoryModel from 'api/models/ProductCategory.model';
import type { JSendResponse } from 'api/types/response.type';

export interface UpdateProductInfoRb {
  name: string;
  category: string;
  description: string;
  shelfLife: number;
  wholesalePrice: number;
  retailPrice: number;
}

const handler = nc<
  NextApiRequest,
  NextApiResponse<
    JSendResponse<IProduct | IPopulatedCategoryProduct | Record<string, string>>
  >
>({
  onError: onMongooseValidationError,
  onNoMatch: defaultOnNoMatch,
})
  .get(async (req, res) => {
    await connectToDB();

    const id = req.query.id as string;

    const product = (await ProductController.getOne({
      id,
      populate: ['category'],
    })) as unknown as IPopulatedCategoryProduct;

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: product,
    });
  })

  .put(async (req, res) => {
    await connectToDB();

    const id = req.query.id as string;
    const requestBody = req.body as UpdateProductInfoRb;

    const originalProduct = await ProductController.getOne({ id });
    const originalCategoryId = originalProduct.category.toString();
    const categoryModified = requestBody.category !== originalCategoryId;

    const updatedProduct = await ProductController.updateOne(id, requestBody);

    // FIXME code to change reference array, haven't figured out the way to do it in middleware and time's running out
    // I'll just inline the code here, fix later
    if (categoryModified) {
      const originalCategory = await ProductCategoryModel().findById(
        originalCategoryId,
      );

      const productIndexInOriginalCategory =
        originalCategory.products.findIndex(
          (product) => product._id.toString() === originalProduct.id,
        );

      if (productIndexInOriginalCategory !== -1) {
        originalCategory.products.splice(productIndexInOriginalCategory, 1);
      }

      originalCategory.save();
      // ====

      const newCategory = await ProductCategoryModel().findById(
        updatedProduct.category,
      );
      newCategory.products.push(new Types.ObjectId(updatedProduct.id));
      newCategory.save();
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: updatedProduct,
    });
  });

export default handler;
