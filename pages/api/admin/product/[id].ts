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
import type { ICdsUpeProduct, IProduct } from 'api/models/Product.model/types';
import ProductCategoryModel from 'api/models/ProductCategory.model';
import type { JSendResponse } from 'api/types/response.type';

export interface UpdateProductInfoRb {
  name: string;
  category: string;
  description: string;
  shelfLife: number;
  wholesalePrice: number;
  retailPrice: number;
  available: boolean;
}

export interface NewProductImageUrlsRb {
  imageUrls: string[];
}

export interface DeleteProductImageUrlRb {
  imageUrl: string;
}

const handler = nc<
  NextApiRequest,
  NextApiResponse<
    JSendResponse<IProduct | ICdsUpeProduct | Record<string, string>>
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
      populate: ['category', 'defaultSupplier'],
    })) as unknown as ICdsUpeProduct;

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: product,
    });
  })

  .put(async (req, res) => {
    await connectToDB();

    const id = req.query.id as string;
    const type = req.query.type as string;

    switch (type) {
      case 'updateInfo': {
        const requestBody = req.body as UpdateProductInfoRb;

        const origProduct = await ProductController.getOne({ id });
        const origCategoryId = origProduct.category.toString();

        const updatedProduct = await ProductController.updateOne(
          id,
          requestBody,
        );
        const updatedCategoryId = updatedProduct.category.toString();

        // FIXME code to change reference array, haven't figured out the way to do it in middleware and time's running out
        // I'll just inline the code here, fix later
        if (origCategoryId !== updatedCategoryId) {
          await ProductCategoryModel().updateOne(
            { _id: origCategoryId },
            { $pull: { products: new Types.ObjectId(id) } },
          );
          await ProductCategoryModel().updateOne(
            { _id: updatedCategoryId },
            { $addToSet: { products: new Types.ObjectId(id) } },
          );
        }

        res.status(StatusCodes.OK).json({
          status: 'success',
          data: updatedProduct,
        });

        return;
      }

      case 'pushImages': {
        const requestBody = req.body as NewProductImageUrlsRb;
        const updatedProduct = await ProductController.pushImageUrls(
          id,
          requestBody.imageUrls,
        );

        res.status(StatusCodes.OK).json({
          status: 'success',
          data: updatedProduct,
        });
        return;
      }

      case 'deleteImage': {
        const requestBody = req.body as DeleteProductImageUrlRb;
        const updatedProduct = await ProductController.deleteImageUrl(
          id,
          requestBody.imageUrl,
        );

        res.status(StatusCodes.OK).json({
          status: 'success',
          data: updatedProduct,
        });
        return;
      }
    }
  });

export default handler;
