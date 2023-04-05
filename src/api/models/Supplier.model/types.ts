import type { Types } from 'mongoose';

import type { IAddress } from 'api/types/schema.type';

export interface ISupplier extends IAddress {
  // _id: Types.ObjectId;
  id: string;
  // NOTE: We might want to see all the orders of a supplier in the future
  // UPDATED: nah, didn't use
  productOrders: Types.ObjectId[]; // IProductOrder

  name: string;
  phone: string;
  email: string;
}

export interface ISupplierDropdown extends Pick<ISupplier, 'id' | 'name'> {}

export interface ISupplierInput
  extends Omit<ISupplier, '_id' | 'productOrders' | 'id'> {
  // productOrders?: Types.ObjectId[]; // IProductOrder
}
