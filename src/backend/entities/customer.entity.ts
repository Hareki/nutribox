import type { Relation } from 'typeorm';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { AccountEntity } from './account.entity';
import { CartItemEntity } from './cartItem.entity';
import { CustomerAddressEntity } from './customerAddress.entity';
import { CustomerOrderEntity } from './customerOrder.entity';

import {
  DateEncryptionTransformer,
  StringEncryptionTransformer,
} from 'backend/transformers';

@Entity({ name: 'customer' })
@Unique('UQ_CUSTOMER_EMAIL', ['email'])
export class CustomerEntity extends AbstractEntity {
  @OneToOne(() => AccountEntity, (account) => account.customer)
  @JoinColumn()
  account: Relation<AccountEntity> | string;

  @OneToMany(
    () => CustomerAddressEntity,
    (customerAddress) => customerAddress.customer,
  )
  customerAddresses: Relation<CustomerAddressEntity>[] | string[];

  @OneToMany(
    () => CustomerOrderEntity,
    (customerOrder) => customerOrder.customer,
  )
  customerOrders: Relation<CustomerOrderEntity>[] | string[];

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.customer)
  cartItems: Relation<CartItemEntity>[] | string[];

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({
    transformer: new StringEncryptionTransformer(),
  })
  phone: string;

  @Column('text', { transformer: new DateEncryptionTransformer() })
  birthday: Date;

  @Column({
    nullable: true,
    transformer: new StringEncryptionTransformer(),
  })
  avatarUrl?: string;
}
