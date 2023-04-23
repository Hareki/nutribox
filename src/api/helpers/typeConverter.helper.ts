import type {
  PoICdsUpeProductWithImages,
  PoIJsonCdsUpeProductWithImages,
  PoIJsonPopulatedCategoryProduct,
  PoIJsonUpeProductWithImages,
  PoIPopulatedCategoryProduct,
  PoIUpeProductWithImages,
} from 'api/mssql/pojos/product.pojo';
import type { PoIProductCategory } from 'api/mssql/pojos/product_category.pojo';
import type { PoIProductOrder } from 'api/mssql/pojos/product_order.pojo';
import type { PoISupplier } from 'api/mssql/pojos/supplier.pojo';

export const parsePoIJsonUpeProductWithImages = (
  product: PoIJsonUpeProductWithImages,
): PoIUpeProductWithImages => ({
  ...product,
  product_orders: JSON.parse(product.product_orders),
  image_urls: JSON.parse(product.image_urls),
});

export const parsePoIJsonCdsUpeProductWithImages = (
  product: PoIJsonCdsUpeProductWithImages,
): PoICdsUpeProductWithImages => ({
  ...product,
  product_orders: JSON.parse(product.product_orders) as PoIProductOrder[],
  image_urls: JSON.parse(product.image_urls) as { image_url: string }[],
  default_supplier: JSON.parse(product.default_supplier) as PoISupplier,
  category: JSON.parse(product.category) as PoIProductCategory,
});

export const parsePoIJsonPopulatedCategoryProduct = (
  product: PoIJsonPopulatedCategoryProduct,
): PoIPopulatedCategoryProduct => ({
  ...product,
  category: JSON.parse(product.category) as PoIProductCategory,
});
