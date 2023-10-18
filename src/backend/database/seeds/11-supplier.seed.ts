import type { Connection } from 'typeorm';
import type { Factory, Seeder } from 'typeorm-seeding';

import type { AddressNameKeys } from './03-customerAddress.seed';

import { SupplierEntity } from 'backend/entities/supplier.entity';
import type { SupplierModel } from 'models/supplier.model';

const supplierSeeds: Omit<
  SupplierModel,
  'createdAt' | 'importOrders' | AddressNameKeys
>[] = [
  {
    id: '97318538-5f74-5f3d-942c-6d87935b1726',
    name: 'Công ty Cổ phần Ba Huân',
    email: 'supplier.bahuan@gmail.com',
    phone: '0338758008',
    provinceCode: 79,
    districtCode: 769,
    wardCode: 26812,
    streetAddress: '12/12 Đường 49',
  },
];

export default class createSuppliers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const supplierRepo = connection.getRepository(SupplierEntity);
    const res = supplierRepo.create(supplierSeeds);
    await supplierRepo.save(res);
  }
}
