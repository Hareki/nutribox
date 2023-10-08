import type { Relation } from 'typeorm';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CustomerEntity } from './customer.entity';

import { CustomerAddressType } from 'backend/enums/Entities.enum';

@Entity({ name: 'customer_address' })
export class CustomerAddressEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CustomerEntity, (customer) => customer.addresses)
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
