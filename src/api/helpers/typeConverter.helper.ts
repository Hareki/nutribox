import type {
  IJsonUpeProductWithImages,
  IUpeProductWithImages,
} from 'api/mssql/pojos/product.pojo';

export const mapJsonUpeToUpe = (
  product: IJsonUpeProductWithImages,
): IUpeProductWithImages => ({
  ...product,
  product_orders: JSON.parse(product.product_orders),
  image_urls: JSON.parse(product.image_urls),
});
