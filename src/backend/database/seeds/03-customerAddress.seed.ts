import type { Connection } from 'typeorm';
import type { Factory, Seeder } from 'typeorm-seeding';

import { CustomerAddressEntity } from 'backend/entities/customerAddress.entity';
import type { CustomerAddressModel } from 'models/customerAddress.model';

export type AddressNameKeys = 'provinceName' | 'districtName' | 'wardName';

type CustomerAddressSeed = Omit<
  CustomerAddressModel,
  'createdAt' | 'customer' | AddressNameKeys
> & {
  customer: {
    id: string;
  };
};

const customerAddressSeeds: CustomerAddressSeed[] = [
  {
    id: '4b0f76a9-65ef-515a-b4dc-d704de1eb08e',
    customer: {
      id: 'e31e759a-edb9-40e8-bb2a-fb6b9e65d986',
    },
    isDefault: true,
    provinceCode: 79,
    districtCode: 769,
    wardCode: 26812,
    streetAddress: '12/12 Đường 49',
    title: 'Nhà riêng',
  },
  {
    id: '8436bf71-a247-5552-85b4-165e12c0b979',
    customer: {
      id: 'e31e759a-edb9-40e8-bb2a-fb6b9e65d986',
    },
    isDefault: false,
    provinceCode: 79,
    districtCode: 760,
    wardCode: 26734,
    streetAddress: '227 Trần Quang Khải',
    title: 'Cơ quan',
  },
];

export default class createCustomerAddresses implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const customerAddressRepo = connection.getRepository(CustomerAddressEntity);
    const res = customerAddressRepo.create(customerAddressSeeds);
    await customerAddressRepo.save(res);
  }
}
