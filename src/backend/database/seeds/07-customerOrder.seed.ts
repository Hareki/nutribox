import type { Connection } from 'typeorm';
import type { Factory, Seeder } from 'typeorm-seeding';

import { CustomerOrderEntity } from 'backend/entities/customerOrder.entity';
import { OrderStatus } from 'backend/enums/Entities.enum';

type CustomerOrderSeed = Omit<
  CustomerOrderEntity,
  | 'account'
  | 'createdAt'
  | 'updatedAt'
  | 'customer'
  | 'paidOnlineVia'
  | 'customerOrderItems'
  | 'deliveredOn'
  | 'cancellationReason'
> & {
  customer: { id: string };
};
const customerOrderSeeds: CustomerOrderSeed[] = [
  {
    id: 'b2d4148b-064d-4262-8ed1-0d13fd3d4b03',
    customer: {
      id: 'e31e759a-edb9-40e8-bb2a-fb6b9e65d986',
    },
    phone: '0338758008',
    provinceCode: '79',
    districtCode: '769',
    wardCode: '26812',
    streetAddress: '123 Nguyen Van Linh',
    note: 'This is note',
    updatedBy: 'e31e759a-edb9-40e8-bb2a-fb6b9e65d986',
    total: 35_000,
    profit: 16_500,
    status: OrderStatus.SHIPPED,
    estimatedDeliveryTime: new Date('2024-09-13'),
    estimatedDistance: 10,
  },
];

export default class createCustomerOrders implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const customerOrderRepo = connection.getRepository(CustomerOrderEntity);
    await customerOrderRepo.save(customerOrderSeeds);
  }
}
