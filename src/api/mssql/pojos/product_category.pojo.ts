import type { PoIProduct, PoIUpeProductWithImages } from './product.pojo';

export interface PoIProductCategory {
  id: string;
  // products: string[];

  name: string;
}

export interface PoIProductCategoryDropdown
  extends Pick<PoIProductCategory, 'id' | 'name'> {}

export interface PoIPopulatedProductCategory
  extends Omit<PoIProductCategory, 'products' | 'id'> {
  id?: string;
  products: PoIProduct[];
}

export interface PoIPopulatedUpeProductCategory
  extends Omit<PoIProductCategory, 'products' | 'id'> {
  id?: string;
  products: PoIUpeProductWithImages[];
}
