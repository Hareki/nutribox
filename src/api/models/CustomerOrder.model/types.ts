import { Types } from 'mongoose';

import { ICustomerOrderItem } from './CustomerOrderItem.schema/types';

import { IAddress } from 'api/types/schema.type';

export interface ICustomerOrder extends IAddress {
  _id: Types.ObjectId;
  id: string;
  items: Types.DocumentArray<ICustomerOrderItem>; // ICustomerOrderItem
  account: Types.ObjectId; // IAccount
  status: Types.ObjectId; // IOrderStatus

  createdAt: Date;
  phone: string;
  paid: boolean;
  note: string;
  profit: number;
}

export interface ICustomerOrderInput
  extends Omit<ICustomerOrder, '_id' | 'note'> {}
