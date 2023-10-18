import type { Connection } from 'typeorm';
import type { Factory, Seeder } from 'typeorm-seeding';

import { CustomerOrderItemEntity } from 'backend/entities/customerOrderItem.entity';
import type { CustomerOrderItemModel } from 'models/customerOrderItem.model';

type CustomerOrderItemSeed = Omit<
  CustomerOrderItemModel,
  | 'createdAt'
  | 'customer'
  | 'customerOrder'
  | 'exportOrders'
  | 'importOrders'
  | 'product'
> & {
  customer: { id: string };
  customerOrder: { id: string };
  product: { id: string };
};

const customerOrderItemSeeds: CustomerOrderItemSeed[] = [
  {
    id: '33aef01f-e573-5527-aec6-d24655384e83',
    customer: {
      id: 'e31e759a-edb9-40e8-bb2a-fb6b9e65d986',
    },
    customerOrder: {
      id: 'b2d4148b-064d-4262-8ed1-0d13fd3d4b03',
    },
    product: {
      id: '2a3ccc96-4f4e-5062-986a-1bcbd711e66c',
    },
    quantity: 1,
    unitRetailPrice: 15_000,
  },
  {
    id: 'a4151e94-5c1c-5ae2-a287-7e52ed55ea71',
    customer: {
      id: 'e31e759a-edb9-40e8-bb2a-fb6b9e65d986',
    },
    customerOrder: {
      id: 'b2d4148b-064d-4262-8ed1-0d13fd3d4b03',
    },
    product: {
      id: 'afa69721-8a38-5dde-9028-062551493e38',
    },
    quantity: 3,
    unitRetailPrice: 10_000,
  },
];

export default class createCustomerOrderItems implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const customerOrderItemRepo = connection.getRepository(
      CustomerOrderItemEntity,
    );
    const res = customerOrderItemRepo.create(customerOrderItemSeeds);
    await customerOrderItemRepo.save(res);
  }
}
