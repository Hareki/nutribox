import type { InfiniteUpePaginationResult } from '../../../../pages/api/product/all';
import type {
  OrderStatusCount,
  OrderStatusCountSQLOutput,
} from '../../../../pages/api/profile/order-status-count';

import { sql } from 'api/database/mssql.config';
import { executeUsp } from 'api/helpers/mssql.helper';
import { mapJsonUpeToUpe } from 'api/helpers/typeConverter.helper';
import type { ICustomerOrderWithJsonItems } from 'api/mssql/pojos/customer_order.pojo';
import type {
  IJsonUpeProductWithImages,
  IUpeProductWithImages,
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
): Promise<GetInfinitePaginationResult<IUpeProductWithImages>> => {
  const queryResult = await executeUsp<
    IJsonUpeProductWithImages,
    UspInfinitePaginationOutput
  >('usp_Products_FetchWithProductOrdersByPage', [
    { name: 'PageSize', type: sql.Int, value: parseInt(docsPerPage) },
    { name: 'PageNumber', type: sql.Int, value: parseInt(page) },
    { name: 'TotalRecords', type: sql.Int, value: null, isOutput: true },
    { name: 'NextPageNumber', type: sql.Int, value: null, isOutput: true },
  ]);

  const upeProducts: IUpeProductWithImages[] =
    queryResult.data.map(mapJsonUpeToUpe);

  const result: InfiniteUpePaginationResult = {
    nextPageNum: queryResult.output.NextPageNumber,
    totalDocs: queryResult.output.TotalRecords,
    docs: upeProducts,
  };

  return result;
};

export const getProduct = async (
  id: string,
): Promise<IUpeProductWithImages> => {
  const queryResult = await executeUsp<IJsonUpeProductWithImages, null>(
    'usp_Product_FetchWithProductOrdersById',
    [{ name: 'Id', type: sql.UniqueIdentifier, value: id }],
  );

  const upeProduct: IUpeProductWithImages = {
    ...queryResult.data[0],
    product_orders: JSON.parse(queryResult.data[0].product_orders),
    image_urls: JSON.parse(queryResult.data[0].image_urls),
  };

  return upeProduct;
};

export const getHotProducts = async (): Promise<IUpeProductWithImages[]> => {
  const queryResult = await executeUsp<IJsonUpeProductWithImages, null>(
    'usp_Products_FetchHotWithProductOrders',
    [{ name: 'Limit', type: sql.Int, value: ProductCarouselLimit }],
  );

  const upeProducts: IUpeProductWithImages[] =
    queryResult.data.map(mapJsonUpeToUpe);

  return upeProducts;
};

export const getNewProducts = async (): Promise<IUpeProductWithImages[]> => {
  const queryResult = await executeUsp<IJsonUpeProductWithImages, null>(
    'usp_Products_FetchNewWithProductOrders',
    [{ name: 'Limit', type: sql.Int, value: ProductCarouselLimit }],
  );

  const upeProducts: IUpeProductWithImages[] =
    queryResult.data.map(mapJsonUpeToUpe);

  return upeProducts;
};

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
): Promise<IUpeProductWithImages[]> {
  const queryResult = await executeUsp<IJsonUpeProductWithImages, null>(
    'usp_Products_FetchRelatedWithProductOrders',
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

  const upeProducts: IUpeProductWithImages[] =
    queryResult.data.map(mapJsonUpeToUpe);

  return upeProducts;
}

export async function getProductSlugs() {
  const queryResult = await executeUsp<{ name: string }>(
    'usp_Products_FetchAllNames',
  );
  const slugs = queryResult.data.map((product) =>
    virtuals.getSlug(product.name),
  );
  return slugs;
}

export async function getAllCategories() {
  const queryResult = await executeUsp<IProductCategory>(
    'usp_ProductCategories_FetchAll',
  );
  return queryResult.data;
}

export async function countOrder(accountId: string) {
  const queryResult = await executeUsp<unknown, OrderStatusCountSQLOutput>(
    'usp_Statistics_FetchOrderStatusCountByAccountId',
    [
      {
        name: 'AccountId',
        type: sql.UniqueIdentifier,
        value: accountId,
      },
      {
        name: 'Total',
        type: sql.Int,
        value: null,
        isOutput: true,
      },
      {
        name: 'Pending',
        type: sql.Int,
        value: null,
        isOutput: true,
      },
      {
        name: 'Processing',
        type: sql.Int,
        value: null,
        isOutput: true,
      },
      {
        name: 'Delivering',
        type: sql.Int,
        value: null,
        isOutput: true,
      },
      {
        name: 'Delivered',
        type: sql.Int,
        value: null,
        isOutput: true,
      },
    ],
  );

  const orderCount: OrderStatusCount = {
    total: queryResult.output.Total,
    pending: queryResult.output.Pending,
    processing: queryResult.output.Processing,
    delivering: queryResult.output.Delivering,
    delivered: queryResult.output.Delivered,
  };

  return orderCount;
}

export async function countAddress(accountId: string) {
  const queryResult = await executeUsp<unknown, { Count: number }>(
    'usp_Statistics_FetchAddressCountByAccountId',
    [
      {
        name: 'AccountId',
        type: sql.UniqueIdentifier,
        value: accountId,
      },
      {
        name: 'Count',
        type: sql.Int,
        value: null,
        isOutput: true,
      },
    ],
  );

  const addressCount = queryResult.output.Count;

  return addressCount;
}

export async function getCustomerOrderWithJsonItems(
  orderId: string,
): Promise<ICustomerOrderWithJsonItems> {
  const queryResult2 = await executeUsp<ICustomerOrderWithJsonItems>(
    'usp_CustomerOrder_FetchWithItemsById',
    [
      {
        name: 'CustomerOrderId',
        type: sql.UniqueIdentifier,
        value: orderId,
      },
    ],
  );

  return queryResult2.data[0];
}

export const verifyAccount = async (token: string) => {
  const FoundAccount = (
    await executeUsp<unknown, { FoundAccount: boolean }>(
      'usp_Account_VerifyOne',
      [
        {
          name: 'Token',
          type: sql.NVarChar,
          value: token,
        },
        {
          name: 'FoundAccount',
          type: sql.Bit,
          value: 1,
          isOutput: true,
        },
      ],
    )
  ).output.FoundAccount;

  return FoundAccount;
};
