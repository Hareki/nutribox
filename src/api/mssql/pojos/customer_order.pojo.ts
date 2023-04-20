import type { IAddress } from './abstract/address.pojo';
import type {
  ICustomerOrderItem,
  ICustomerOrderItemInput,
} from './customer_order_item.pojo';

export interface ICustomerOrder extends IAddress {
  id: string;
  //   items: string[]; // ICustomerOrderItem
  account_id: string;
  status_id: string;

  created_at: string;
  phone: string;

  paid: boolean;
  note: string;
  profit: number;
  total: number;

  estimated_delivery_time: Date | string;
  estimated_distance: number;

  delivered_on?: Date | string;
}

export interface ICustomerOrderWithJsonItems extends ICustomerOrder {
  items: string;
}

export interface ICustomerOrderWithItems extends ICustomerOrder {
  items: ICustomerOrderItem;
}

export interface ICustomerOrderInput
  extends Omit<ICustomerOrder, 'id' | 'created_at' | 'items'> {
  items: ICustomerOrderItemInput[];
}
