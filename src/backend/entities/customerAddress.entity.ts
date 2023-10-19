import type { Relation } from 'typeorm';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AddressAbstractEntity } from './addressAbstract.entity';
import { CustomerEntity } from './customer.entity';

@Entity({ name: 'customer_address' })
export class CustomerAddressEntity extends AddressAbstractEntity {
  @ManyToOne(() => CustomerEntity, (customer) => customer.customerAddresses)
  @JoinColumn({ name: 'customer_id' })
  customer: Relation<CustomerEntity> | string;

  @Column()
  isDefault: boolean;

  @Column('text')
  title: string;
}
