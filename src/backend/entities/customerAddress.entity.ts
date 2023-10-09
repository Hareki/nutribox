import type { Relation } from 'typeorm';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { CustomerEntity } from './customer.entity';

import { CustomerAddressType } from 'backend/enums/Entities.enum';

@Entity({ name: 'customer_address' })
export class CustomerAddressEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CustomerEntity, (customer) => customer.customerAddresses)
  customer: Relation<CustomerEntity>;

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
