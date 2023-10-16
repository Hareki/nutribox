import type { Connection } from 'typeorm';
import type { Factory, Seeder } from 'typeorm-seeding';

import { ExportOrderEntity } from 'backend/entities/exportOrder.entity';

type ExportOrderSeed = Omit<
  ExportOrderEntity,
  'createdAt' | 'importOrder' | 'customerOrderItem'
> & {
  importOrder: {
    id: string;
  };
  customerOrderItem: {
    id: string;
  };
};

const importOrderSeeds: ExportOrderSeed[] = [
  {
    id: 'c8c202e1-9793-5cb3-9bcc-ee2432953fb9',
    customerOrderItem: {
      id: '33aef01f-e573-5527-aec6-d24655384e83',
    },
    importOrder: {
      id: '49fcbc8f-9fe0-5854-8de1-e3c7071d4e10',
    },
    quantity: 1,
  },
  {
    id: 'fb53e4f5-7fe0-54b6-b968-7bdeab636f67',
    customerOrderItem: {
      id: 'a4151e94-5c1c-5ae2-a287-7e52ed55ea71',
    },
    importOrder: {
      id: 'add9187c-c0fd-5596-b0eb-c6ad5a3cdd11',
    },
    quantity: 1,
  },
  {
    id: '5b5f0007-1a55-534d-b8b2-02e4b64b2509',
    customerOrderItem: {
      id: 'a4151e94-5c1c-5ae2-a287-7e52ed55ea71',
    },
    importOrder: {
      id: '385041f0-22e1-5b00-8f35-26057c2829c3',
    },
    quantity: 2,
  },
];

export default class createExportOrders implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const exportOrderRepo = connection.getRepository(ExportOrderEntity);
    await exportOrderRepo.save(importOrderSeeds);
  }
}
