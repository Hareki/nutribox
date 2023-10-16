import type { Relation } from 'typeorm';
import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { CustomerOrderEntity } from './customerOrder.entity';
import { ExportOrderEntity } from './exportOrder.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'customer_order_item' })
@Unique('UQ_customerOrder_product', ['customerOrder', 'product'])
export class CustomerOrderItemEntity extends AbstractEntity {
  @ManyToOne(
    () => CustomerOrderEntity,
    (customerOrder) => customerOrder.customerOrderItems,
  )
  customerOrder: Relation<CustomerOrderEntity> | string;

  @ManyToOne(() => ProductEntity, (product) => product.customerOrderItems)
  product: Relation<ProductEntity> | string;

  @OneToMany(
    () => ExportOrderEntity,
    (exportOrder) => exportOrder.customerOrderItem,
  )
  exportOrders: Relation<ExportOrderEntity>[] | string[];

  @Column('decimal')
  unitRetailPrice: number;

  @Column('int')
  quantity: number;
}
