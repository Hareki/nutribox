import type { Relation } from 'typeorm';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { CustomerOrderItemEntity } from './customerOrderItem.entity';
import { ImportOrderEntity } from './importOrder.entity';

@Entity({ name: 'export_order' })
export class ExportOrderEntity extends AbstractEntity {
  @PrimaryColumn('uuid', { name: 'import_order_id' })
  @ManyToOne(() => ImportOrderEntity, (importOrder) => importOrder.exportOrders)
  importOrder: Relation<ImportOrderEntity>;

  @PrimaryColumn('uuid', { name: 'customer_order_item_id' })
  @ManyToOne(
    () => CustomerOrderItemEntity,
    (customerOrderItem) => customerOrderItem.exportOrders,
  )
  customerOrderItem: Relation<CustomerOrderItemEntity>;

  @Column('int')
  quantity: number;
}
