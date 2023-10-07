import type { Relation } from 'typeorm';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CustomerEntity } from './customer.entity';
import { CustomerOrderItemEntity } from './customerOrderItem.entity';

import { OrderStatus, PaymentMethod } from 'backend/enums/Entities.enum';

@Entity({ name: 'customer_order' })
export class CustomerOrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CustomerEntity, (customer) => customer.orders, {
    nullable: true,
  })
  customer: Relation<CustomerEntity>;

  @OneToMany(
    () => CustomerOrderItemEntity,
    (customerOrderItem) => customerOrderItem.order,
  )
  orderItems: Relation<CustomerOrderItemEntity>[];

  @Column('date')
  createdAt: Date;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Column()
  phone: string;

  @Column({ type: 'enum', enum: PaymentMethod })
  paidOnlineVia: PaymentMethod;

  @Column()
  provinceCode: string;

  @Column()
  districtCode: string;

  @Column()
  wardCode: string;

  @Column()
  streetAddress: string;

  @Column({ nullable: true })
  note: string;

  @Column('decimal')
  profit: number;

  @Column('decimal')
  total: number;

  @Column('date')
  estimatedDeliveryTime: Date;

  @Column('decimal')
  estimatedDistance: number;

  @Column({ nullable: true, type: 'date' })
  deliveredOn: Date;

  @Column('uuid')
  modifiedBy: string;

  @Column('date')
  modifiedAt: Date;

  @Column()
  cancellationReason: string;
}
