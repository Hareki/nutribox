import type { Relation } from 'typeorm';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { AddressAbstractEntity } from './addressAbstract.entity';
import { CustomerEntity } from './customer.entity';

import { CustomerAddressType } from 'backend/enums/entities.enum';
import { getAddressName } from 'helpers/address.helper';

@Entity({ name: 'customer_address' })
export class CustomerAddressEntity extends AddressAbstractEntity {
  @ManyToOne(() => CustomerEntity, (customer) => customer.customerAddresses)
  @JoinColumn({ name: 'customer_id' })
  customer: Relation<CustomerEntity> | string;

  @Column()
  isDefault: boolean;

  @Column({ type: 'enum', enum: CustomerAddressType })
  type: CustomerAddressType;
}
