import type { PoIAddress } from './abstract/address.pojo';
import type {
  PoICustomerOrderItem,
  ICustomerOrderItemInput,
} from './customer_order_item.pojo';

export interface PoICustomerOrder extends PoIAddress {
  id: string;
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

export interface PoICustomerOrderWithJsonItems extends PoICustomerOrder {
  items: string;
}

export interface PoICustomerOrderWithItems extends PoICustomerOrder {
  items: PoICustomerOrderItem;
}

export interface PoICustomerOrderInput
  extends Omit<PoICustomerOrder, 'id' | 'created_at' | 'items'> {
  items: ICustomerOrderItemInput[];
}
