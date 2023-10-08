import type { Relation } from 'typeorm';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { CustomerOrderItemEntity } from './customerOrderItem.entity';
import { ImportOrderEntity } from './importOrder.entity';

@Entity({ name: 'export_order' })
export class ExportOrderEntity {
  @PrimaryColumn('uuid', { name: 'id' })
  @ManyToOne(() => ImportOrderEntity, (importOrder) => importOrder.exportOrders)
  importOrder: Relation<ImportOrderEntity>;

  @PrimaryColumn('uuid', { name: 'id' })
  @ManyToOne(
    () => CustomerOrderItemEntity,
    (customerOrderItem) => customerOrderItem.exportOrders,
  )
  customerOrderItem: Relation<CustomerOrderItemEntity>;

  @Column('int')
  quantity: number;
}
