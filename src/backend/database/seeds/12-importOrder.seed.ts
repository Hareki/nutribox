import { addDays } from 'date-fns';
import type { Connection } from 'typeorm';
import type { Factory, Seeder } from 'typeorm-seeding';

import { ImportOrderEntity } from 'backend/entities/importOrder.entity';
import type { ImportOrderModel } from 'models/importOder.model';

type ImportOrderSeed = Omit<
  ImportOrderModel,
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
  {
    id: 'b85c9706-4a9c-54b8-b83f-b897336e725c',
    importDate: new Date(),
    manufacturingDate: addDays(new Date(), -5),
    expirationDate: addDays(new Date(), -5 + 60),
    product: {
      id: 'd1b3ce4d-6a49-5991-b330-8eaf371c6efd',
    },
    supplier: {
      id: '97318538-5f74-5f3d-942c-6d87935b1726',
    },
    importQuantity: 10,
    remainingQuantity: 10,
    unitImportPrice: 6500,
  },
  {
    id: '3f44a820-2db4-552f-9681-121ffda15a89',
    importDate: new Date(),
    manufacturingDate: addDays(new Date(), -1),
    expirationDate: addDays(new Date(), -1 + 60),
    product: {
      id: 'd1b3ce4d-6a49-5991-b330-8eaf371c6efd',
    },
    supplier: {
      id: '97318538-5f74-5f3d-942c-6d87935b1726',
    },
    importQuantity: 5,
    remainingQuantity: 5,
    unitImportPrice: 6500,
  },
];

export default class createImportOrders implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const customerOrderItemRepo = connection.getRepository(ImportOrderEntity);
    const res = customerOrderItemRepo.create(importOrderSeeds);
    await customerOrderItemRepo.save(res);
  }
}
