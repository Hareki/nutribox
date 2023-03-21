import type { Types } from 'mongoose';

import type { IAddress } from 'api/types/schema.type';

export interface ISupplier extends IAddress {
  // _id: Types.ObjectId;
  id: string;
  // NOTE: We might want to see all the orders of a supplier in the future
  productOrders: Types.ObjectId[]; // IProductOrder

  name: string;
  phone: string;
  email: string;
}

export interface ISupplierInput
  extends Omit<ISupplier, '_id' | 'productOrders'> {
  productOrders?: Types.ObjectId[]; // IProductOrder
}
