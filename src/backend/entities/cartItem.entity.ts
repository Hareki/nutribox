import type { Relation } from 'typeorm';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { CustomerEntity } from './customer.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'cart_item' })
export class CartItemEntity {
  @PrimaryColumn({
    type: 'uuid',
    name: 'product_id',
  })
  @ManyToOne(() => ProductEntity, (product) => product.cartItems)
  product: Relation<ProductEntity>;

  @PrimaryColumn({
    type: 'uuid',
    name: 'customer_id',
  })
  @ManyToOne(() => CustomerEntity, (customer) => customer.cartItems)
  customer: Relation<CustomerEntity>;

  @Column('int')
  quantity: number;
}
