import type { Relation } from 'typeorm';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { CustomerEntity } from './customer.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'cart_item' })
@Unique('UQ_product_customer', ['product', 'customer'])
export class CartItemEntity extends AbstractEntity {
  @ManyToOne(() => ProductEntity, (product) => product.cartItems)
  product: Relation<ProductEntity> | string;

  @ManyToOne(() => CustomerEntity, (customer) => customer.cartItems)
  customer: Relation<CustomerEntity> | string;

  @Column('int')
  quantity: number;
}
