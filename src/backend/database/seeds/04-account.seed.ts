import type { Connection } from 'typeorm';
import type { Factory, Seeder } from 'typeorm-seeding';

import { AccountEntity } from 'backend/entities/account.entity';
import { hashPassword } from 'backend/helpers/auth.helper';
import type { AccountModel } from 'models/account.model';

type AccountSeed = Pick<
  AccountModel,
  'id' | 'email' | 'password' | 'verified'
> & {
  employee?: {
    id: string;
  };
  customer?: {
    id: string;
  };
};

const accountSeeds: AccountSeed[] = [
  {
    id: '28dc8380-219e-5957-a8fb-f362b46bfd05',
    email: 'admin@gmail.com',
    password: hashPassword('Admin@123'),
    employee: {
      id: 'e18e7d23-55bd-48b0-b2fd-64ca6932df27',
    },
    verified: true,
  },
  {
    id: '2f56080e-0c93-565c-bd95-7bb8ac341ac2',
    email: 'customer@gmail.com',
    password: hashPassword('Admin@123'),
    customer: {
      id: 'e31e759a-edb9-40e8-bb2a-fb6b9e65d986',
    },
    verified: true,
  },
];

export default class createAccounts implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const accountRepo = connection.getRepository(AccountEntity);
    const res = accountRepo.create(accountSeeds);
    await accountRepo.save(res);
  }
}
