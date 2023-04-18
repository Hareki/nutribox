import type { IProductOrder } from './product_order.pojo';

export interface IExportHistory {
  id: string;
  product_order_id: string;
  customer_order_item_id: string;

  quantity: number;
}

export interface IPopulatedExportHistory
  extends Omit<IExportHistory, 'product_order_id'> {
  product_order_id: IProductOrder;
}

export interface IExportHistoryInput extends Omit<IExportHistory, 'id'> {}
