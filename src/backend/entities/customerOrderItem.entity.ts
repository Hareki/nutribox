import type { Relation } from 'typeorm';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { CustomerOrderEntity } from './customerOrder.entity';
import { ExportOrderEntity } from './exportOrder.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'customer_order_item' })
export class CustomerOrderItemEntity {
  @ManyToOne(
    () => CustomerOrderEntity,
    (customerOrder) => customerOrder.orderItems,
  )
  order: Relation<CustomerOrderEntity>;

  @ManyToOne(() => ProductEntity, (product) => product.orderItems)
  product: Relation<ProductEntity>;

  @Column('decimal')
  unitRetailPrice: number;

  @Column('decimal')
  unitImportPrice: number;

  @Column('int')
  quantity: number;

  @OneToMany(
    () => ExportOrderEntity,
    (exportOrder) => exportOrder.customerOrderItem,
  )
  exportOrders: Relation<ExportOrderEntity>[];
}
