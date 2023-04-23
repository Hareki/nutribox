import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnNoMatch, onValidationError } from 'api/base/next-connect';
import { executeUsp, getProductInputArray } from 'api/helpers/mssql.helper';
import { parsePoIJsonPopulatedCategoryProduct } from 'api/helpers/typeConverter.helper';
import type { IProduct } from 'api/models/Product.model/types';
import type {
  PoIJsonPopulatedCategoryProduct,
  PoIPopulatedCategoryProduct,
} from 'api/mssql/pojos/product.pojo';
import type {
  JSendErrorResponse,
  JSendFailResponse,
  JSendSuccessResponse,
} from 'api/types/response.type';

export interface CreateProductRb
  extends Omit<
    IProduct,
    'id' | 'expirations' | 'defaultSupplier' | 'category' | 'slug' | 'imageUrls'
  > {
  category: string;
}

const handler = nc<
  NextApiRequest,
  NextApiResponse<
    | JSendSuccessResponse<PoIPopulatedCategoryProduct>
    | JSendFailResponse<Record<string, string>>
    | JSendErrorResponse
  >
>({
  onError: onValidationError,
  onNoMatch: defaultOnNoMatch,
}).post(async (req, res) => {
  const requestBody = req.body as CreateProductRb;

  const jsonPopulatedProduct = (
    await executeUsp<PoIJsonPopulatedCategoryProduct>('usp_Product_CreateOne', [
      ...getProductInputArray(requestBody),
    ])
  ).data[0];

  const populatedProduct =
    parsePoIJsonPopulatedCategoryProduct(jsonPopulatedProduct);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: populatedProduct,
  });
});

export default handler;
