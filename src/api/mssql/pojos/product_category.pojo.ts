import type { PoIProduct, PoIUpeProductWithImages } from './product.pojo';

export interface IProductCategory {
  id: string;
  // products: string[];

  name: string;
}

export interface IProductCategoryDropdown
  extends Pick<IProductCategory, 'id' | 'name'> {}

export interface IPopulatedProductCategory
  extends Omit<IProductCategory, 'products' | 'id'> {
  id?: string;
  products: PoIProduct[];
}

export interface IPopulatedUpeProductCategory
  extends Omit<IProductCategory, 'products' | 'id'> {
  id?: string;
  products: PoIUpeProductWithImages[];
}

export interface IProductCategoryInput
  extends Omit<IProductCategory, 'products'> {
  products?: string[];
}
