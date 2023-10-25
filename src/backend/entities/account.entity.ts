import type { Relation } from 'typeorm';
import { Column, Entity, JoinColumn, OneToOne, Unique } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { CustomerEntity } from './customer.entity';
import { EmployeeEntity } from './employee.entity';

import { StringEncryptionTransformer } from 'backend/transformers';

@Entity({ name: 'account' })
@Unique('UQ_ACCOUNT_EMAIL', ['email'])
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

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    default: false,
  })
  disabled: boolean;

  @Column({
    default: false,
  })
  verified: boolean;

  @Column({ nullable: true, transformer: new StringEncryptionTransformer() })
  verificationToken?: string;

  @Column({ nullable: true, type: 'timestamp with time zone' })
  verificationTokenExpiry?: Date;

  @Column({ nullable: true, transformer: new StringEncryptionTransformer() })
  forgotPasswordToken?: string;

  @Column({ nullable: true, type: 'timestamp with time zone' })
  forgotPasswordTokenExpiry?: Date;
}
