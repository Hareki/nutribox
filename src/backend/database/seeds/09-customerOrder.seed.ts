import type { Connection } from 'typeorm';
import type { Factory, Seeder } from 'typeorm-seeding';

import type { AddressNameKeys } from './03-customerAddress.seed';

import { CustomerOrderEntity } from 'backend/entities/customerOrder.entity';
import { OrderStatus } from 'backend/enums/entities.enum';
import type { CustomerOrderModel } from 'models/customerOrder.model';

type CustomerOrderSeed = Omit<
  CustomerOrderModel,
  | 'account'
  | 'createdAt'
  | 'updatedAt'
  | 'customer'
  | 'paidOnlineVia'
  | 'customerOrderItems'
  | 'deliveredOn'
  | 'cancellationReason'
  | AddressNameKeys
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
    provinceCode: 79,
    districtCode: 769,
    wardCode: 26812,
    streetAddress: '12/12 Đường 49',
    note: 'This is note',
    updatedBy: '28dc8380-219e-5957-a8fb-f362b46bfd05',
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
    const res = customerOrderRepo.create(customerOrderSeeds);
    await customerOrderRepo.save(res);
  }
}
