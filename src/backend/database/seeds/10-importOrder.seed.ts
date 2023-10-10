import { addDays } from 'date-fns';
import type { Connection } from 'typeorm';
import type { Factory, Seeder } from 'typeorm-seeding';

import { ImportOrderEntity } from 'backend/entities/importOrder.entity';

type ImportOrderSeed = Omit<
  ImportOrderEntity,
  'createdAt' | 'product' | 'exportOrders' | 'supplier'
> & {
  product: {
    id: string;
  };
  supplier: {
    id: string;
  };
};

const importOrderSeeds: ImportOrderSeed[] = [
  {
    id: '49fcbc8f-9fe0-5854-8de1-e3c7071d4e10',
    importDate: new Date(),
    manufacturingDate: addDays(new Date(), -3),
    expirationDate: addDays(new Date(), -3 + 15),
    product: {
      id: '2a3ccc96-4f4e-5062-986a-1bcbd711e66c',
    },
    supplier: {
      id: '97318538-5f74-5f3d-942c-6d87935b1726',
    },
    importQuantity: 10,

    remainingQuantity: 9,
    unitImportPrice: 5500,
  },
  {
    id: 'add9187c-c0fd-5596-b0eb-c6ad5a3cdd11',
    importDate: new Date(),
    manufacturingDate: addDays(new Date(), -10),
    expirationDate: addDays(new Date(), -10 + 60),
    product: {
      id: 'afa69721-8a38-5dde-9028-062551493e38',
    },
    supplier: {
      id: '97318538-5f74-5f3d-942c-6d87935b1726',
    },
    importQuantity: 1,
    remainingQuantity: 0,
    unitImportPrice: 6500,
  },
  {
    id: '385041f0-22e1-5b00-8f35-26057c2829c3',
    importDate: new Date(),
    manufacturingDate: addDays(new Date(), -5),
    expirationDate: addDays(new Date(), -5 + 60),
    product: {
      id: 'afa69721-8a38-5dde-9028-062551493e38',
    },
    supplier: {
      id: '97318538-5f74-5f3d-942c-6d87935b1726',
    },
    importQuantity: 3,
    remainingQuantity: 1,
    unitImportPrice: 6500,
  },
];

export default class createImportOrders implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const customerOrderItemRepo = connection.getRepository(ImportOrderEntity);
    await customerOrderItemRepo.save(importOrderSeeds);
  }
}
