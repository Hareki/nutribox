import type { IProductCategory } from './product_category.pojo';
import type { PoIProductOrder } from './product_order.pojo';
import type { PoISupplier } from './supplier.pojo';

// UPE = Unexpired and Populated Expirations, we usually use this type instead of IProduct
// CDS = Populated category and default supplier

export interface PoIProduct {
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

export interface PoIPopulatedCategoryProduct extends PoIProduct {
  category: IProductCategory;
}

export interface PoIUpeProductWithImages extends PoIProduct {
  product_orders: PoIProductOrder[];
  image_urls: { image_url: string }[];
}

export interface PoIJsonUpeProductWithImages extends PoIProduct {
  product_orders: string;
  image_urls: string;
}

export interface PoICdsProduct extends PoIProduct {
  category: IProductCategory;
  default_supplier: PoISupplier;
}
export interface PoICdsUpeProduct extends PoICdsProduct {
  product_orders: PoIProductOrder[];
}

export interface PoIProductWithTotalQuantity extends PoIProduct {
  total_unexpired_remaining_stock: number;
}

export interface PoIProductInput extends Omit<PoIProduct, 'id' | 'available'> {
  product_orders: string[];
  available?: boolean;
}
