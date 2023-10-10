import type { Connection } from 'typeorm';
import type { Factory, Seeder } from 'typeorm-seeding';

import { CustomerEntity } from 'backend/entities/customer.entity';

const customerSeeds: Omit<
  CustomerEntity,
  'account' | 'createdAt' | 'customerAddresses' | 'customerOrders' | 'cartItems'
>[] = [
  {
    id: 'e31e759a-edb9-40e8-bb2a-fb6b9e65d986',
    firstName: 'Phúc',
    lastName: 'Trần Minh',
    email: 'customer@gmail.com',
    phone: '0123456789',
    birthday: new Date('2000-01-01'),
  },
];

export default class createCustomers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const customerRepo = connection.getRepository(CustomerEntity);
    await customerRepo.save(customerSeeds);
  }
}
