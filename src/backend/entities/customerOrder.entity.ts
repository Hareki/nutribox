import type { Relation } from 'typeorm';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { CustomerEntity } from './customer.entity';
import { CustomerOrderItemEntity } from './customerOrderItem.entity';

import { OrderStatus, PaymentMethod } from 'backend/enums/Entities.enum';

@Entity({ name: 'customer_order' })
export class CustomerOrderEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CustomerEntity, (customer) => customer.orders, {
    nullable: true,
  })
  customer: Relation<CustomerEntity>;

  @OneToMany(
    () => CustomerOrderItemEntity,
    (customerOrderItem) => customerOrderItem.customerOrder,
  )
  customerOrderItems: Relation<CustomerOrderItemEntity>[];

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Column()
  phone: string;

  @Column({ type: 'enum', enum: PaymentMethod, nullable: true })
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

  @Column('timestamp without time zone')
  estimatedDeliveryTime: Date;

  @Column('decimal')
  estimatedDistance: number;

  @Column({ nullable: true, type: 'timestamp without time zone' })
  deliveredOn: Date;

  @Column('uuid')
  updatedBy: string;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column()
  cancellationReason: string;
}
