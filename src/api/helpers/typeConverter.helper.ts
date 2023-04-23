import type {
  PoIJsonUpeProductWithImages,
  PoIUpeProductWithImages,
} from 'api/mssql/pojos/product.pojo';

export const mapJsonUpeToUpe = (
  product: PoIJsonUpeProductWithImages,
): PoIUpeProductWithImages => ({
  ...product,
  product_orders: JSON.parse(product.product_orders),
  image_urls: JSON.parse(product.image_urls),
});
