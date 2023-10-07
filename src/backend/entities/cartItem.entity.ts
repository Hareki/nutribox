import type { Relation } from 'typeorm';
import { Column, Entity, ManyToOne } from 'typeorm';

import { CustomerEntity } from './customer.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'cart_item' })
export class CartItemEntity {
  @ManyToOne(() => ProductEntity, (product) => product.cartItems)
  product: Relation<ProductEntity>;

  @ManyToOne(() => CustomerEntity, (customer) => customer.cartItems)
  customer: Relation<CustomerEntity>;

  @Column('int')
  quantity: number;
}
