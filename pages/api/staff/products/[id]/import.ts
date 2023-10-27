import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import type { ImportProductDto } from 'backend/dtos/product/importProduct.dto';
import { BaseImportProductDtoSchema } from 'backend/dtos/product/importProduct.dto';
import { ProductEntity } from 'backend/entities/product.entity';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createValidationGuard } from 'backend/services/common/common.guard';
import { CommonService } from 'backend/services/common/common.service';
import {
  createImportPriceGuard,
  createMaxQuantityGuard,
} from 'backend/services/product/product.guard';
import { ProductService } from 'backend/services/product/product.service';
import type { JSSuccess } from 'backend/types/jsend';
import type { ImportOrderModel } from 'models/importOder.model';

type SuccessResponse = JSSuccess<ImportOrderModel>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler.post(
  createValidationGuard(BaseImportProductDtoSchema),
  createMaxQuantityGuard(),
  createImportPriceGuard(),
  async (req, res) => {
    const productId = req.query.id as string;
    const importOrder = await ProductService.importProduct(
      productId,
      req.body as ImportProductDto,
    );

    await CommonService.updateRecord(ProductEntity, productId, {
      defaultImportPrice: importOrder.unitImportPrice,
      defaultSupplier: importOrder.supplier,
    });

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: importOrder,
    });
  },
);

export default handler;
