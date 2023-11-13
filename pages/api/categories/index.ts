import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { ProductCategoryEntity } from 'backend/entities/productCategory.entity';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { CommonService } from 'backend/services/common/common.service';
import type { JSSuccess } from 'backend/types/jsend';
import type { ProductCategoryModel } from 'models/productCategory.model';

type SuccessResponse = JSSuccess<ProductCategoryModel[]>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler.get(async (req, res) => {
  const [data] = await CommonService.getRecords({
    entity: ProductCategoryEntity,
    filter: {
      available: true,
    },
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: data as ProductCategoryModel[],
  });
});

export default handler;
