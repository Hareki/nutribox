import type { Relation } from 'typeorm';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

import { CustomerOrderEntity } from './customerOrder.entity';
import { ExportOrderEntity } from './exportOrder.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'customer_order_item' })
export class CustomerOrderItemEntity {
  @ManyToOne(
    () => CustomerOrderEntity,
    (customerOrder) => customerOrder.customerOrderItems,
  )
  @PrimaryColumn({
    type: 'uuid',
    name: 'customer_order_id',
  })
  customerOrder: Relation<CustomerOrderEntity>;

  @ManyToOne(() => ProductEntity, (product) => product.customerOrderItems)
  @PrimaryColumn({
    type: 'uuid',
    name: 'product_id',
  })
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
