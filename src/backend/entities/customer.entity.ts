import type { Relation } from 'typeorm';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

import { AccountEntity } from './account.entity';
import { CartItemEntity } from './cartItem.entity';
import { CustomerAddressEntity } from './customerAddress.entity';
import { CustomerOrderEntity } from './customerOrder.entity';

@Entity({ name: 'customer' })
export class CustomerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => AccountEntity, (account) => account.customer)
  @JoinColumn()
  account: Relation<AccountEntity>;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column('date')
  birthday: Date;

  @OneToMany(
    () => CustomerAddressEntity,
    (customerAddress) => customerAddress.customer,
  )
  addresses: Relation<CustomerAddressEntity>[];

  @OneToMany(
    () => CustomerOrderEntity,
    (customerOrder) => customerOrder.customer,
  )
  orders: Relation<CustomerOrderEntity>[];

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.customer)
  cartItems: Relation<CartItemEntity>[];
}
