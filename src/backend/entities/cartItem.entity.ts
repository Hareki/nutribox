import type { Relation } from 'typeorm';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { CustomerEntity } from './customer.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'cart_item' })
export class CartItemEntity {
  @PrimaryColumn('uuid', { name: 'id' })
  @ManyToOne(() => ProductEntity, (product) => product.cartItems)
  product: Relation<ProductEntity>;

  @PrimaryColumn('uuid', { name: 'id' })
  @ManyToOne(() => CustomerEntity, (customer) => customer.cartItems)
  customer: Relation<CustomerEntity>;

  @Column('int')
  quantity: number;
}
