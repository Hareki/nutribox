import type { Relation } from 'typeorm';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { AddressAbstractEntity } from './addressAbstract.entity';
import { CustomerEntity } from './customer.entity';

@Entity({ name: 'customer_address' })
@Unique('UQ_customer_title', ['customer', 'title'])
export class CustomerAddressEntity extends AddressAbstractEntity {
  @ManyToOne(() => CustomerEntity, (customer) => customer.customerAddresses)
  @JoinColumn({ name: 'customer_id' })
  customer: Relation<CustomerEntity> | string;

  @Column()
  isDefault: boolean;

  @Column({
    type: 'text',
  })
  title: string;
}
