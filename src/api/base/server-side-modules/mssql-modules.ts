import type { InfiniteUpePaginationResult } from '../../../../pages/api/product/all';

import { sql } from 'api/database/mssql.config';
import { executeUsp } from 'api/helpers/mssql.helper';
import { mapJsonUpeToUpe } from 'api/helpers/typeConverter.helper';
import type {
  IJsonUpeProduct,
  IUpeProduct,
} from 'api/mssql/pojos/product.pojo';
import type { IProductCategory } from 'api/mssql/pojos/product_category.pojo';
import { virtuals } from 'api/mssql/virtuals';
import type {
  GetInfinitePaginationResult,
  UspInfinitePaginationOutput,
} from 'api/types/pagination.type';
import { ProductCarouselLimit, RelatedProductsLimit } from 'utils/constants';

export const getAllProducts = async (
  docsPerPage: string,
  page: string,
): Promise<GetInfinitePaginationResult<IUpeProduct>> => {
  const queryResult = await executeUsp<
    IJsonUpeProduct[],
    UspInfinitePaginationOutput
  >('usp_FetchUpeProductsByPage', [
    { name: 'PageSize', type: sql.Int, value: docsPerPage },
    { name: 'PageNumber', type: sql.Int, value: page },
    { name: 'TotalRecords', type: sql.Int, value: null, isOutput: true },
    { name: 'NextPageNumber', type: sql.Int, value: null, isOutput: true },
  ]);

  const upeProducts: IUpeProduct[] = queryResult.data.map(mapJsonUpeToUpe);

  const result: InfiniteUpePaginationResult = {
    nextPageNum: queryResult.output.NextPageNumber,
    totalDocs: queryResult.output.TotalRecords,
    docs: upeProducts,
  };

  return result;
};

export const getProduct = async (id: string): Promise<IUpeProduct> => {
  const queryResult = await executeUsp<IJsonUpeProduct[], null>(
    'usp_FetchUpeProductById',
    [{ name: 'Id', type: sql.UniqueIdentifier, value: id }],
  );

  const upeProduct: IUpeProduct = {
    ...queryResult.data[0],
    product_orders: JSON.parse(queryResult.data[0].product_orders),
  };

  return upeProduct;
};

export const getHotProducts = async (): Promise<IUpeProduct[]> => {
  const queryResult = await executeUsp<IJsonUpeProduct[], null>(
    'usp_FetchHotUpeProducts',
    [{ name: 'Limit', type: sql.Int, value: ProductCarouselLimit }],
  );

  const upeProducts: IUpeProduct[] = queryResult.data.map(mapJsonUpeToUpe);

  return upeProducts;
};

export const getNewProducts = async (): Promise<IUpeProduct[]> => {
  const queryResult = await executeUsp<IJsonUpeProduct[], null>(
    'usp_FetchNewUpeProducts',
    [{ name: 'Limit', type: sql.Int, value: ProductCarouselLimit }],
  );

  const upeProducts: IUpeProduct[] = queryResult.data.map(mapJsonUpeToUpe);

  return upeProducts;
};

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
): Promise<IUpeProduct[]> {
  const queryResult = await executeUsp<IJsonUpeProduct[], null>(
    'usp_FetchRelatedUpeProducts',
    [
      { name: 'Limit', type: sql.Int, value: RelatedProductsLimit },
      {
        name: 'CategoryId',
        type: sql.UniqueIdentifier,
        value: categoryId,
      },
      {
        name: 'ProductId',
        type: sql.UniqueIdentifier,
        value: productId,
      },
    ],
  );

  const upeProducts: IUpeProduct[] = queryResult.data.map(mapJsonUpeToUpe);

  return upeProducts;
}

export async function getProductSlugs() {
  const queryResult = await executeUsp<{ name: string }[]>(
    'usp_FetchAllProductNames',
  );
  const slugs = queryResult.data.map((product) =>
    virtuals.getSlug(product.name),
  );
  return slugs;
}

export async function getAllCategories() {
  const queryResult = await executeUsp<IProductCategory[]>(
    'usp_FetchAllProductCategories',
  );
  return queryResult.data;
}
