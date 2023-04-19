import type {
  IJsonUpeProduct,
  IUpeProduct,
} from 'api/mssql/pojos/product.pojo';

export const mapJsonUpeToUpe = (product: IJsonUpeProduct): IUpeProduct => ({
  ...product,
  product_orders: JSON.parse(product.product_orders),
});
