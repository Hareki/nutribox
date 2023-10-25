import type { Relation } from 'typeorm';
import { Column, Entity, OneToOne, JoinColumn, OneToMany } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { AccountEntity } from './account.entity';
import { ReviewResponseEntity } from './reviewResponse.entity';

import { EmployeeRole } from 'backend/enums/entities.enum';
import {
  DateEncryptionTransformer,
  StringEncryptionTransformer,
} from 'backend/transformers';

@Entity({ name: 'employee' })
export class EmployeeEntity extends AbstractEntity {
  @OneToMany(
    () => ReviewResponseEntity,
    (reviewResponse) => reviewResponse.employee,
  )
  reviewResponses: Relation<ReviewResponseEntity>[] | string[];

  @Column({
    transformer: new StringEncryptionTransformer(),
    unique: true,
  })
  personalId: string;

  @Column({ type: 'enum', enum: EmployeeRole })
  role: EmployeeRole;

  @OneToOne(() => AccountEntity, (account) => account.employee, {
    nullable: true,
  })
  @JoinColumn()
  account?: Relation<AccountEntity> | string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    transformer: new StringEncryptionTransformer(),
    unique: true,
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
