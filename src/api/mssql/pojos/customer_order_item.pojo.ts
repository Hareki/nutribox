import type { IExportHistory } from './export_history.pojo';

export interface PoICustomerOrderItem {
  id: string;
  customer_order_id: string;
  product_id: string;

  quantity: number;
  unit_import_price: number;
  unit_retail_price: number;
  created_at: Date | string;
}

export interface PoICustomerOrderItemWithJsonExportHistory
  extends PoICustomerOrderItem {
  export_history: string;
}

export interface PoICustomerOrderItemWithExportHistory
  extends PoICustomerOrderItem {
  export_history: IExportHistory[];
}

export interface ICustomerOrderItemInput
  extends Omit<PoICustomerOrderItem, 'id' | 'created_at'> {
  export_history: IExportHistory[];
}
