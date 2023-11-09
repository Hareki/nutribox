import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { UpdateProductCategorySchema } from 'backend/dtos/categories/updateProductCategory.dto';
import { ProductCategoryEntity } from 'backend/entities/productCategory.entity';
import { isDuplicateError } from 'backend/helpers/validation.helper';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createValidationGuard } from 'backend/services/common/common.guard';
import { CommonService } from 'backend/services/common/common.service';
import { DuplicationError } from 'backend/types/errors/common';
import type { JSSuccess } from 'backend/types/jsend';
import type { ProductCategoryModel } from 'models/productCategory.model';

type SuccessResponse = JSSuccess<ProductCategoryModel>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler
  .get(async (req, res) => {
    const id = req.query.id as string;
    const data = (await CommonService.getRecord({
      entity: ProductCategoryEntity,
      filter: {
        id,
      },
    })) as ProductCategoryModel;

    res.status(StatusCodes.OK).json({
      status: 'success',
      data,
    });
  })
  .put(createValidationGuard(UpdateProductCategorySchema), async (req, res) => {
    try {
      const id = req.query.id as string;
      const updatedCategory = (await CommonService.updateRecord(
        ProductCategoryEntity,
        id,
        req.body,
      )) as ProductCategoryModel;

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: updatedCategory,
      });
    } catch (error) {
      if (isDuplicateError(error)) {
        if (error.message.includes('UQ_PRODUCT_CATEGORY_NAME')) {
          throw new DuplicationError('name', 'ProductCategory.Name.Duplicate');
        }
      }
      throw error;
    }
  });

export default handler;
