import type { Types } from 'mongoose';

import type { IProduct } from '../Product.model/types';

export interface IProductCategory {
  _id: Types.ObjectId;
  id: string;
  products: Types.ObjectId[]; // IProduct

  slug: string;
  name: string;
}

export interface IPopulatedProductCategory
  extends Omit<IProductCategory, 'products' | '_id'> {
  _id?: Types.ObjectId;
  products: IProduct[];
}

export interface IProductCategoryInput
  extends Omit<IProductCategory, '_id' | 'products' | 'slug'> {
  products?: Types.ObjectId[]; // IProduct
}
