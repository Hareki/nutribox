import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextHandler } from 'next-connect';

import { ProductService } from './product.service';

import type { ImportProductDto } from 'backend/dtos/product/importProduct.dto';
import { getMaxProductQuantity } from 'helpers/product.helper';

export const createMaxQuantityGuard =
  () =>
  async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    const importProductDto = req.body as ImportProductDto;
    const productId = req.query.id as string;

    const commonProduct = await ProductService.getCommonProduct({
      filter: {
        id: productId,
      },
    });
    const maxQuantity = commonProduct.maxQuantity;
    const currentInStock = getMaxProductQuantity(commonProduct.importOrders);
    if (currentInStock + importProductDto.importQuantity > maxQuantity) {
      const exceededQuantity =
        currentInStock + importProductDto.importQuantity - maxQuantity;
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'fail',
        data: {
          importQuantity: 'Product.ImportQuantity.Exceeded',
          params: [exceededQuantity],
        },
      });
    }

    return next();
  };
