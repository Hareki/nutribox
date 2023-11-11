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
    id: '163cd73b-b208-5326-89d5-8a665270784d',
    email: 'warehouse_manager@gmail.com',
    password: hashPassword('Admin@123'),
    employee: {
      id: 'a5a42bd9-f8c8-5af5-a371-75c30867736c',
    },
    verified: true,
  },
  {
    id: '2535e19a-9cab-52b6-b6f5-6dc551878a8b',
    email: 'cashier@gmail.com',
    password: hashPassword('Admin@123'),
    employee: {
      id: '64558cb0-5c20-56f0-b2bd-2af67c030779',
    },
    verified: true,
  },
  {
    id: '7c851e8d-bd21-5236-9dcb-2924444cf3e7',
    email: 'shipper@gmail.com',
    password: hashPassword('Admin@123'),
    employee: {
      id: '049162b6-7571-53de-8039-6bb4f3bfc172',
    },
    verified: true,
  },
  {
    id: 'fc036dde-6637-5402-8c93-cba6658ce768',
    email: 'warehouse_staff@gmail.com',
    password: hashPassword('Admin@123'),
    employee: {
      id: '621a0d4a-1308-5d43-b669-b320a17c6876',
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
