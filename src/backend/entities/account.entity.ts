import type { Relation } from 'typeorm';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { CustomerEntity } from './customer.entity';
import { EmployeeEntity } from './employee.entity';

@Entity({ name: 'account' })
export class AccountEntity extends AbstractEntity {
  @OneToOne(() => CustomerEntity, (customer) => customer.account, {
    nullable: true,
  })
  @JoinColumn()
  customer?: Relation<CustomerEntity> | string;

  @OneToOne(() => EmployeeEntity, (employee) => employee.account, {
    nullable: true,
  })
  @JoinColumn()
  employee?: Relation<EmployeeEntity> | string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({
    default: false,
  })
  disabled: boolean;

  @Column({
    default: false,
  })
  verified: boolean;

  @Column({ nullable: true })
  verificationToken?: string;

  @Column({ nullable: true, type: 'timestamp with time zone' })
  verificationTokenExpiry?: Date;

  @Column({ nullable: true })
  forgotPasswordToken?: string;

  @Column({ nullable: true, type: 'timestamp with time zone' })
  forgotPasswordTokenExpiry?: Date;
}
