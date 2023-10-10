import type { Relation } from 'typeorm';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { CustomerEntity } from './customer.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'cart_item' })
export class CartItemEntity extends AbstractEntity {
  @ManyToOne(() => ProductEntity, (product) => product.cartItems)
  product: Relation<ProductEntity> | string;

  @ManyToOne(() => CustomerEntity, (customer) => customer.cartItems)
  customer: Relation<CustomerEntity> | string;

  @Column('int')
  quantity: number;
}
