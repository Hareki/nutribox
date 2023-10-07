import type { Relation } from 'typeorm';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CustomerOrderItemEntity } from './customerOrderItem.entity';
import { ImportOrderEntity } from './importOrder.entity';

@Entity({ name: 'export_order' })
export class ExportOrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ImportOrderEntity, (importOrder) => importOrder.exportOrders)
  importOrder: Relation<ImportOrderEntity>;

  @ManyToOne(
    () => CustomerOrderItemEntity,
    (customerOrderItem) => customerOrderItem.exportOrders,
  )
  customerOrderItem: Relation<CustomerOrderItemEntity>;

  @Column('int')
  quantity: number;
}
