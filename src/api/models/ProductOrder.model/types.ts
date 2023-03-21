import type { Types } from 'mongoose';

export interface IProductOrder {
  // _id: Types.ObjectId;
  id: string;
  product: Types.ObjectId; // IProduct
  supplier: Types.ObjectId; // ISupplier
  status: Types.ObjectId; // IOrderStatus

  quantity: number;
  unitWholesalePrice: number;
  createdAt: Date;
}

export interface IProductOrderInput
  extends Omit<IProductOrder, '_id' | 'createdAt'> {}
