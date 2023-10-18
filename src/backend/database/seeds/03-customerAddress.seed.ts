import type { Connection } from 'typeorm';
import type { Factory, Seeder } from 'typeorm-seeding';

import { CustomerAddressEntity } from 'backend/entities/customerAddress.entity';
import { CustomerAddressType } from 'backend/enums/entities.enum';

type CustomerAddressSeed = Omit<
  CustomerAddressEntity,
  'createdAt' | 'customer'
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
    provinceName: 'Thành phố Hồ Chí Minh',
    districtName: 'Thành phố Thủ Đức',
    wardName: 'Phường Hiệp Bình Chánh',
    streetAddress: '12/12 Đường 49',
    type: CustomerAddressType.HOME,
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
    provinceName: 'Thành phố Hồ Chí Minh',
    districtName: 'Quận 1',
    wardName: 'Phường Tân Định',
    streetAddress: '227 Trần Quang Khải',
    type: CustomerAddressType.OFFICE,
  },
];

export default class createCustomerAddresses implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const customerAddressRepo = connection.getRepository(CustomerAddressEntity);
    await customerAddressRepo.save(customerAddressSeeds);
  }
}
