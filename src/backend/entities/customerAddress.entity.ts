import type { Relation } from 'typeorm';
import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { CustomerEntity } from './customer.entity';

import { CustomerAddressType } from 'backend/enums/entities.enum';

@Entity({ name: 'customer_address' })
export class CustomerAddressEntity extends AbstractEntity {
  @ManyToOne(() => CustomerEntity, (customer) => customer.customerAddresses)
  customer: Relation<CustomerEntity> | string;

  @Column()
  provinceCode: string;

  @Column()
  districtCode: string;

  @Column()
  wardCode: string;

  @Column()
  streetAddress: string;

  @Column()
  isDefault: boolean;

  @Column({ type: 'enum', enum: CustomerAddressType })
  type: CustomerAddressType;
}
