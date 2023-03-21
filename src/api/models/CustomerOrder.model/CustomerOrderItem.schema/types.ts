import type { Types } from 'mongoose';

export interface ICustomerOrderItem {
  // _id: Types.ObjectId;
  id: string;
  product: Types.ObjectId; // IProduct
  // Note: No need, because it's already embedded in the customerOrder
  // customerOrder: ICustomerOrder;

  quantity: number;
  unitRetailPrice: number;
}

export interface ICustomerOrderItemInput
  extends Omit<ICustomerOrderItem, '_id'> {}
