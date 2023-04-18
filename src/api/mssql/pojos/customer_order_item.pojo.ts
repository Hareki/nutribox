import type { IExportHistory } from './export_history.pojo';

export interface ICustomerOrderItem {
  id: string;
  customer_order_id: string;
  product_id: string;

  quantity: number;
  unit_import_price: number;
  unit_retail_price: number;
  export_history: string[];
  created_at: Date | string;
}

export interface ICustomerOrderItemInputWithoutConsumption
  extends Omit<ICustomerOrderItem, 'id' | 'export_history'> {}

export interface ICustomerOrderItemInput
  extends ICustomerOrderItemInputWithoutConsumption {
  export_history: IExportHistory[];
}
