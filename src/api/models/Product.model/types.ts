import type { Types } from 'mongoose';

import type { IExpiration } from '../Expiration.model/types';
import type { IProductCategory } from '../ProductCategory.model/types';
import type { ISupplier } from '../Supplier.model/types';

export interface IProduct {
  // _id: Types.ObjectId;
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

  defaultSupplier: Types.ObjectId;
}

export interface IPopulatedExpirationProduct
  extends Omit<IProduct, 'expirations'> {
  expirations: IExpiration[];
}

// UPE = Unexpired and Populated Expirations, we usually use this type instead of IProduct
export interface IUpeProduct extends Omit<IProduct, 'expirations'> {
  expirations: IExpiration[];
}

// CDS = Populated category and default supplier
export interface ICdsProduct
  extends Omit<IProduct, 'category' | 'defaultSupplier'> {
  category: IProductCategory;
  defaultSupplier: ISupplier;
}
export interface ICdsUpeProduct extends Omit<ICdsProduct, 'expirations'> {
  expirations: IExpiration[];
}

export interface IProductWithTotalQuantity extends IProduct {
  totalQuantity: number;
}

export interface IProductInput
  extends Omit<
    IProduct,
    '_id' | 'slug' | 'expirations' | 'available' | 'hot' | 'id'
  > {
  expirations?: Types.ObjectId[]; // IExpiration
  available?: boolean;
  hot?: boolean;
}
