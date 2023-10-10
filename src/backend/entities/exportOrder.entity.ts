import type { Relation } from 'typeorm';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { CustomerOrderItemEntity } from './customerOrderItem.entity';
import { ImportOrderEntity } from './importOrder.entity';

@Entity({ name: 'export_order' })
@Unique('UQ_importOrder_customerOrderItem', [
  'importOrder',
  'customerOrderItem',
])
export class ExportOrderEntity extends AbstractEntity {
  @ManyToOne(() => ImportOrderEntity, (importOrder) => importOrder.exportOrders)
  importOrder: Relation<ImportOrderEntity> | string;

  @ManyToOne(
    () => CustomerOrderItemEntity,
    (customerOrderItem) => customerOrderItem.exportOrders,
  )
  customerOrderItem: Relation<CustomerOrderItemEntity> | string;

  @Column('int')
  quantity: number;
}
