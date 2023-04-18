import type { IProduct, IUpeProduct } from './product.pojo';

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
  products: IProduct[];
}

export interface IPopulatedUpeProductCategory
  extends Omit<IProductCategory, 'products' | 'id'> {
  id?: string;
  products: IUpeProduct[];
}

export interface IProductCategoryInput
  extends Omit<IProductCategory, 'products'> {
  products?: string[];
}
