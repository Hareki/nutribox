import type { Relation } from 'typeorm';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { CustomerEntity } from './customer.entity';

import { CustomerAddressType } from 'backend/enums/entities.enum';

@Entity({ name: 'customer_address' })
export class CustomerAddressEntity extends AbstractEntity {
  @ManyToOne(() => CustomerEntity, (customer) => customer.customerAddresses)
  @JoinColumn({ name: 'customer_id' })
  customer: Relation<CustomerEntity> | string;

  @Column('int')
  provinceCode: number;

  @Column('int')
  districtCode: number;

  @Column('int')
  wardCode: number;

  @Column('text')
  provinceName: string;

  @Column('text')
  districtName: string;

  @Column('text')
  wardName: string;

  @Column()
  streetAddress: string;

  @Column()
  isDefault: boolean;

  @Column({ type: 'enum', enum: CustomerAddressType })
  type: CustomerAddressType;
}
