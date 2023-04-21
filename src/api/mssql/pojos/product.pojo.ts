import type { IProductCategory } from './product_category.pojo';
import type { IProductOrder } from './product_order.pojo';
import type { ISupplier } from './supplier.pojo';

export interface IProduct {
  id: string;
  category_id: string;
  default_supplier_id: string;

  name: string;
  description: string;
  shelf_life: number;
  available: boolean;
  import_price: number;
  retail_price: number;
}

export interface IPopulatedCategoryProduct
  extends Omit<IProduct, 'category_id'> {
  category_id: IProductCategory;
}

// UPE = Unexpired and Populated Expirations, we usually use this type instead of IProduct
export interface IUpeProductWithImages
  extends Omit<IProduct, 'product_orders'> {
  product_orders: IProductOrder[];
  image_urls: { image_url: string }[];
}

export interface IJsonUpeProductWithImages
  extends Omit<IUpeProductWithImages, 'product_orders' | 'image_urls'> {
  product_orders: string;
  image_urls: string;
}

// CDS = Populated category and default supplier
export interface ICdsProduct
  extends Omit<IProduct, 'category_id' | 'default_supplier_id'> {
  category_id: IProductCategory;
  default_supplier_id: ISupplier;
}
export interface ICdsUpeProduct extends Omit<ICdsProduct, 'product_orders'> {
  product_orders: IProductOrder[];
}

export interface IProductWithTotalQuantity extends IProduct {
  total_unexpired_remaining_stock: number;
}

export interface IProductInput
  extends Omit<IProduct, 'id' | 'product_orders' | 'available'> {
  product_orders: string[];
  available?: boolean;
}
