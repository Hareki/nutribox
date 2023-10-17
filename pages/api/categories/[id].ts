import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { ProductCategoryEntity } from 'backend/entities/productCategory.entity';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { CategoryService } from 'backend/services/category/category.service';
import type { CategoryWithProducts } from 'backend/services/category/helper';
import { CommonService } from 'backend/services/common/common.service';
import type { JSSuccess } from 'backend/types/jsend';
import type { ProductCategoryModel } from 'models/productCategory.model';

type SuccessResponse = JSSuccess<CategoryWithProducts | ProductCategoryModel>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler.get(async (req, res) => {
  const noProducts = req.query.noProducts as string;
  const id = req.query.id as string;

  if (noProducts) {
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
    return;
  }
  const data = await CategoryService.getCategoryWithProducts(id);
  res.status(StatusCodes.OK).json({
    status: 'success',
    data,
  });
});

export default handler;
