import { Types } from 'mongoose';

import { IProductCategory } from '../ProductCategory.model/types';

export interface IProduct {
  _id: Types.ObjectId;
  id: string;
  slug: string;
  imageUrls: string[];
  category: Types.ObjectId; // IProductCategory
  // NOTE: Can't embed Expiration into Product
  //       Because We need to loop through all the expirations and find the top 5 closest expirations to the current date for STATISTICS
  expirations: Types.ObjectId[]; // IExpiration

  // NOTE: No need to include these, no task requires it for now
  // cartItems: ICartItem[]
  // customerOrderItems: ICustomerOrderItem[]
  // productOrders: IProductOrder[]

  description: string;
  shelfLife: number;
  available: boolean;
  wholesalePrice: number;
  retailPrice: number;
  hot: boolean;
  name: string;
}

export interface IPopulatedProduct extends Omit<IProduct, 'category'> {
  category: IProductCategory;
}

export interface IProductInput
  extends Omit<IProduct, '_id' | 'slug' | 'expirations' | 'available' | 'hot'> {
  expirations?: Types.ObjectId[]; // IExpiration
  available?: boolean;
  hot?: boolean;
}
