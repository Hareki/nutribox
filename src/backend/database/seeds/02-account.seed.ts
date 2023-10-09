import type { Connection } from 'typeorm';
import type { Factory, Seeder } from 'typeorm-seeding';

import { AccountEntity } from 'backend/entities/account.entity';
import { hashPassword } from 'backend/utils/auth.helper';

type AccountSeed = Pick<AccountEntity, 'email' | 'password'> & {
  employee: {
    id: string;
  };
};

const accountSeeds: AccountSeed[] = [
  {
    email: 'MinhTu@gmail.com',
    password: hashPassword('123456'),
    employee: {
      id: 'e18e7d23-55bd-48b0-b2fd-64ca6932df27',
    },
  },
  {
    email: 'MinhPhuc@gmail.com',
    password: hashPassword('123456'),
    employee: {
      id: 'e31e759a-edb9-40e8-bb2a-fb6b9e65d986',
    },
  },
];

export default class createAccounts implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const accountRepo = connection.getRepository(AccountEntity);
    await accountRepo.save(accountSeeds);
  }
}
