import { z } from 'zod';

import type { CustomerOrderModel } from './customerOrder.model';
import type { ExportOrderModel } from './exportOrder.model';
import { zodNumber, zodUuid } from './helper';
import type { ProductModel } from './product.model';

const CustomerOrderItemSchema = z.object({
  customerOrder: zodUuid('CustomerOrderItem.CustomerOrderId'),

  product: zodUuid('CustomerOrderItem.ProductId'),

  unitRetailPrice: zodNumber(
    'CustomerOrderItem.UnitRetailPrice',
    'float',
    0,
    10_000_000,
  ),

  unitImportPrice: zodNumber(
    'CustomerOrderItem.UnitImportPrice',
    'float',
    0,
    10_000_000,
  ),

  quantity: zodNumber('CustomerOrderItem.Quantity', 'int', 1, 1000),

  exportOrders: z.array(z.string().uuid()).optional(),
});

type CustomerOrderItemModel = z.infer<typeof CustomerOrderItemSchema>;

type CustomerOrderItemReferenceKeys = keyof Pick<
  CustomerOrderItemModel,
  'customerOrder' | 'product' | 'exportOrders'
>;

type PopulateField<K extends keyof CustomerOrderItemModel> =
  K extends 'customerOrder'
    ? CustomerOrderModel
    : K extends 'product'
    ? ProductModel
    : K extends 'exportOrders'
    ? ExportOrderModel[]
    : never;

type PopulateCustomerOrderItemFields<K extends CustomerOrderItemReferenceKeys> =
  Omit<CustomerOrderItemModel, K> & {
    [P in K]: PopulateField<P>;
  };

type FullyPopulatedCustomerOrderItemModel =
  PopulateCustomerOrderItemFields<CustomerOrderItemReferenceKeys>;

export { CustomerOrderItemSchema };
export type {
  CustomerOrderItemModel,
  FullyPopulatedCustomerOrderItemModel,
  PopulateCustomerOrderItemFields,
};
