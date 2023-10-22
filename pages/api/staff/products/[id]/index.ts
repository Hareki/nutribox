import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import type { NewProductImagesDto } from 'backend/dtos/product/newProductImages.dto';
import { NewProductImagesDtoSchema } from 'backend/dtos/product/newProductImages.dto';
import type { RemoveProductImageDto } from 'backend/dtos/product/removeProductImage.dto';
import { RemoveProductImageDtoSchema } from 'backend/dtos/product/removeProductImage.dto';
import { UpdateProductDtoSchema } from 'backend/dtos/product/updateProduct.dto';
import { ProductEntity } from 'backend/entities/product.entity';
import { isDuplicateError } from 'backend/helpers/validation.helper';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createValidationGuard } from 'backend/services/common/common.guard';
import { CommonService } from 'backend/services/common/common.service';
import {
  type CommonProductModel,
  type ExtendedCommonProductModel,
} from 'backend/services/product/helper';
import { ProductService } from 'backend/services/product/product.service';
import { DuplicationError } from 'backend/types/errors/common';
import type { JSSuccess } from 'backend/types/jsend';
import type { ProductModel } from 'models/product.model';

type SuccessResponse = JSSuccess<
  ExtendedCommonProductModel | ProductModel | CommonProductModel
>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler
  .get(async (req, res) => {
    const id = req.query.id as string;
    const data =
      (await ProductService.getCommonProduct<ExtendedCommonProductModel>({
        filter: {
          id,
        },
        extended: true,
      })) as ExtendedCommonProductModel;

    res.status(StatusCodes.OK).json({
      status: 'success',
      data,
    });
  })
  // update information
  .put(createValidationGuard(UpdateProductDtoSchema), async (req, res) => {
    try {
      const id = req.query.id as string;
      const updatedProduct = (await CommonService.updateRecord(
        ProductEntity,
        id,
        req.body,
      )) as ProductModel;

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: updatedProduct,
      });
    } catch (error) {
      if (isDuplicateError(error)) {
        throw new DuplicationError('name', 'Product.Name.Duplicate');
      }
      throw error;
    }
  })
  // add images
  .post(createValidationGuard(NewProductImagesDtoSchema), async (req, res) => {
    const productId = req.query.id as string;
    const updatedProduct = await ProductService.pushImages(
      productId,
      (req.body as NewProductImagesDto).productImages,
    );

    res.status(StatusCodes.CREATED).json({
      status: 'success',
      data: updatedProduct,
    });
  })
  // delete an image
  .patch(
    createValidationGuard(RemoveProductImageDtoSchema),
    async (req, res) => {
      const productId = req.query.id as string;
      const updatedProduct = await ProductService.removeImage(
        productId,
        (req.body as RemoveProductImageDto).productImageUrl,
      );

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: updatedProduct,
      });
    },
  );

export default handler;
