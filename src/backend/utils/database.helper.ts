import 'reflect-metadata';

import { createConnection, getConnection, getConnectionManager } from 'typeorm';
import type {
  ConnectionOptions,
  ObjectLiteral,
  ObjectType,
  Repository,
  Connection,
} from 'typeorm';

import { SnakeNamingStrategy } from './snakeCaseNamingStrategy.helper';

import { AccountEntity } from 'backend/entities/account.entity';
import { CartItemEntity } from 'backend/entities/cartItem.entity';
import { CustomerEntity } from 'backend/entities/customer.entity';
import { CustomerAddressEntity } from 'backend/entities/customerAddress.entity';
import { CustomerOrderEntity } from 'backend/entities/customerOrder.entity';
import { CustomerOrderItemEntity } from 'backend/entities/customerOrderItem.entity';
import { EmployeeEntity } from 'backend/entities/employee.entity';
import { ExportOrderEntity } from 'backend/entities/exportOrder.entity';
import { ImportOrderEntity } from 'backend/entities/importOrder.entity';
import { ProductEntity } from 'backend/entities/product.entity';
import { ProductCategoryEntity } from 'backend/entities/productCategory.entity';
import { ProductImageEntity } from 'backend/entities/productImage.entity';
import { ReviewEntity } from 'backend/entities/review.entity';
import { ReviewResponseEntity } from 'backend/entities/reviewResponse.entity';
import { StoreEntity } from 'backend/entities/store.entity';
import { StoreWorkTimeEntity } from 'backend/entities/storeWorkTime.entity';
import { SupplierEntity } from 'backend/entities/supplier.entity';

const connectionOptions: Record<string, ConnectionOptions> = {
  default: {
    name: 'default',
    type: 'postgres',
    host: process.env.DB_HOST,
    // VERCEL
    // ssl: true,
    // LOCAL
    ssl: false,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    namingStrategy: new SnakeNamingStrategy(),
    entities: [
      ProductCategoryEntity,
      ProductEntity,
      ProductImageEntity,
      AccountEntity,
      EmployeeEntity,
      CustomerEntity,
      CustomerAddressEntity,
      CartItemEntity,
      CustomerOrderEntity,
      CustomerOrderItemEntity,
      ImportOrderEntity,
      ExportOrderEntity,
      ReviewEntity,
      ReviewResponseEntity,
      SupplierEntity,
      StoreEntity,
      StoreWorkTimeEntity,
    ],
  },
};

function entitiesChanged(prevEntities: any[], newEntities: any[]): boolean {
  if (prevEntities.length !== newEntities.length) return true;

  for (let i = 0; i < prevEntities.length; i++) {
    if (prevEntities[i] !== newEntities[i]) return true;
  }

  return false;
}

async function updateConnectionEntities(
  connection: Connection,
  entities: any[],
) {
  if (!entitiesChanged(connection.options.entities || [], entities)) return;

  // @ts-ignore
  connection.options.entities = entities;

  // @ts-ignore
  connection.buildMetadatas();

  if (connection.options.synchronize) {
    await connection.synchronize();
  }
}

export async function ensureConnection(name = 'default'): Promise<Connection> {
  const connectionManager = getConnectionManager();

  if (connectionManager.has(name)) {
    const connection = connectionManager.get(name);

    if (!connection.isConnected) {
      await connection.connect();
    }

    if (process.env.NODE_ENV !== 'production') {
      await updateConnectionEntities(
        connection,
        connectionOptions[name].entities as any,
      );
    }

    return connection;
  }

  return await connectionManager
    .create({ name, ...connectionOptions[name] })
    .connect();
}

// ================

let connectionReadyPromise: Promise<any> | null = null;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function prepareConnection() {
  if (!connectionReadyPromise) {
    connectionReadyPromise = (async () => {
      // clean up old connection that references outdated hot-reload classes
      try {
        const staleConnection = getConnection();
        await staleConnection.close();
      } catch (error) {
        // no stale connection to clean up
      }

      // wait for new default connection
      await createConnection(connectionOptions.default);
    })();
  }

  return connectionReadyPromise;
}

export const getRepo = async <T extends ObjectLiteral>(
  entity: ObjectType<T>,
): Promise<Repository<T>> => {
  await prepareConnection();
  return getConnectionManager().get('default').getRepository(entity);
  // const connection = await ensureConnection();
  // return connection.getRepository(entity);
};
