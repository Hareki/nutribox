import type { Relation } from 'typeorm';
import { Column, Entity, OneToOne, Unique } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { AccountEntity } from './account.entity';

import { EmployeeRole } from 'backend/enums/entities.enum';
import {
  DateEncryptionTransformer,
  StringEncryptionTransformer,
} from 'backend/transformers';

@Entity({ name: 'employee' })
@Unique('UQ_EMPLOYEE_PERSONAL_ID', ['personalId'])
@Unique('UQ_EMPLOYEE_EMAIL', ['email'])
@Unique('UQ_EMPLOYEE_PHONE', ['phone'])
export class EmployeeEntity extends AbstractEntity {
  @Column({
    transformer: new StringEncryptionTransformer(),
  })
  personalId: string;

  @Column({ type: 'enum', enum: EmployeeRole })
  role: EmployeeRole;

  @OneToOne(() => AccountEntity, (account) => account.employee, {
    nullable: true,
  })
  // @JoinColumn()
  account?: Relation<AccountEntity> | string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({
    transformer: new StringEncryptionTransformer(),
  })
  phone: string;

  @Column('text', { transformer: new DateEncryptionTransformer() })
  birthday: Date;

  @Column({
    nullable: true,
    transformer: new StringEncryptionTransformer(),
  })
  avatarUrl?: string;
}
