import type { Relation } from 'typeorm';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

import { AddressAbstractEntity } from './addressAbstract.entity';
import { CustomerEntity } from './customer.entity';
import { CustomerOrderItemEntity } from './customerOrderItem.entity';

import { OrderStatus, PaymentMethod } from 'backend/enums/entities.enum';

@Entity({ name: 'customer_order' })
export class CustomerOrderEntity extends AddressAbstractEntity {
  @ManyToOne(() => CustomerEntity, (customer) => customer.customerOrders, {
    nullable: true,
  })
  customer?: Relation<CustomerEntity> | string;

  @OneToMany(
    () => CustomerOrderItemEntity,
    (customerOrderItem) => customerOrderItem.customerOrder,
  )
  customerOrderItems: Relation<CustomerOrderItemEntity>[] | string[];

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Column()
  phone: string;

  @Column({ type: 'enum', enum: PaymentMethod, nullable: true })
  paidOnlineVia?: PaymentMethod;

  @Column({ nullable: true })
  note?: string;

  @Column('decimal')
  profit: number;

  @Column('decimal')
  total: number;

  @Column('timestamp with time zone')
  estimatedDeliveryTime: Date;

  @Column('decimal')
  estimatedDistance: number;

  @Column({ nullable: true, type: 'timestamp with time zone' })
  deliveredOn?: Date;

  @Column('uuid')
  updatedBy: string;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column({
    nullable: true,
  })
  cancellationReason?: string;
}
