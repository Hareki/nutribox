import type { Types } from 'mongoose';

import type {
  ICustomerOrderItem,
  ICustomerOrderItemInput,
} from './CustomerOrderItem.schema/types';

import type { IAddress } from 'api/types/schema.type';

export interface ICustomerOrder extends IAddress {
  // _id: Types.ObjectId;
  id: string;
  items: Types.DocumentArray<ICustomerOrderItem>; // ICustomerOrderItem
  account: Types.ObjectId; // IAccount
  status: Types.ObjectId; // IOrderStatus

  createdAt: string;
  phone: string;
  // indicate that the order is paid COD or online
  paid: boolean;
  note: string;
  profit: number;
  total: number;

  // FIXME: have to be Date type for the schema, although when serializing to JSON, it will be string
  // => Should have separate type for schema and type for JSON
  estimatedDeliveryTime: Date | string;
  estimatedDistance: number;

  deliveredOn?: Date | string;
}

export interface ICustomerOrderInput
  extends Omit<ICustomerOrder, '_id' | 'id' | 'createdAt' | 'items'> {
  items: ICustomerOrderItemInput[];
}
