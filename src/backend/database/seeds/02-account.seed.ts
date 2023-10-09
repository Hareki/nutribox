import type { Connection } from 'typeorm';
import type { Factory, Seeder } from 'typeorm-seeding';

import { AccountEntity } from 'backend/entities/account.entity';

const accountSeeds: Pick<AccountEntity, 'email' | 'password'>[] = [
  {
    email: 'MinhTu@gmail.com',
    password: '123456',
  },
  {
    email: 'MinhPhuc@gmail.com',
    password: '123456',
  },
];

export default class createAccounts implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(AccountEntity)
      .values(accountSeeds)
      .orUpdate()
      .orIgnore()
      .execute();
  }
}
