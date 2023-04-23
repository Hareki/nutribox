import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnNoMatch, onValidationError } from 'api/base/next-connect';
import { getProduct } from 'api/base/server-side-modules/mssql-modules';
import { sql } from 'api/database/mssql.config';
import { executeUsp, getProductInputArray } from 'api/helpers/mssql.helper';
import { parsePoIJsonCdsUpeProductWithImages } from 'api/helpers/typeConverter.helper';
import type {
  PoICdsUpeProductWithImages,
  PoIJsonCdsUpeProductWithImages,
  PoIProduct,
  PoIUpeProductWithImages,
} from 'api/mssql/pojos/product.pojo';
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
    JSendResponse<
      | PoIUpeProductWithImages
      | PoICdsUpeProductWithImages
      | Record<string, string>
    >
  >
>({
  onError: onValidationError,
  onNoMatch: defaultOnNoMatch,
})
  .get(async (req, res) => {
    const jsonProduct = (
      await executeUsp<PoIJsonCdsUpeProductWithImages>(
        'usp_Product_FetchCdsUpeWithImagesById',
        [
          {
            name: 'ProductId',
            type: sql.UniqueIdentifier,
            value: req.query.id,
          },
        ],
      )
    ).data[0];

    const parsedProduct = parsePoIJsonCdsUpeProductWithImages(jsonProduct);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: parsedProduct,
    });
  })

  .put(async (req, res) => {
    const id = req.query.id as string;
    const type = req.query.type as string;

    switch (type) {
      case 'updateInfo': {
        const requestBody = req.body as UpdateProductInfoRb;

        await executeUsp<PoIProduct>('usp_Product_UpdateOne', [
          {
            name: 'ProductId',
            type: sql.UniqueIdentifier,
            value: id,
          },
          ...getProductInputArray(requestBody),
        ]);

        const updatedProduct = await getProduct(id);

        res.status(StatusCodes.OK).json({
          status: 'success',
          data: updatedProduct,
        });

        return;
      }

      case 'pushImages': {
        const requestBody = req.body as NewProductImageUrlsRb;
        const pushImagePromises = requestBody.imageUrls.map(
          async (imageUrl) =>
            await executeUsp('usp_ProductImage_CreateOne', [
              {
                name: 'ProductId',
                type: sql.UniqueIdentifier,
                value: id,
              },
              {
                name: 'ImageUrl',
                type: sql.NVarChar,
                value: imageUrl,
              },
            ]),
        );

        await Promise.all(pushImagePromises);

        const updatedProduct = await getProduct(id);

        res.status(StatusCodes.OK).json({
          status: 'success',
          data: updatedProduct,
        });
        return;
      }

      case 'deleteImage': {
        const requestBody = req.body as DeleteProductImageUrlRb;

        await executeUsp('usp_ProductImage_DeleteOne', [
          {
            name: 'ProductId',
            type: sql.UniqueIdentifier,
            value: id,
          },
          {
            name: 'ImageUrl',
            type: sql.NVarChar,
            value: requestBody.imageUrl,
          },
        ]);

        const updatedProduct = await getProduct(id);
        res.status(StatusCodes.OK).json({
          status: 'success',
          data: updatedProduct,
        });
        return;
      }
    }
  });

export default handler;
