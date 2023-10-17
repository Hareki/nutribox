import 'reflect-metadata';

import { createConnection, getConnection, getConnectionManager } from 'typeorm';
import type {
  ObjectLiteral,
  ObjectType,
  Repository,
  Connection,
} from 'typeorm';
import type { ConnectionOptions } from 'typeorm-seeding';

import ormconfig from '../../../ormconfig';

const connectionOptions: Record<string, ConnectionOptions> = {
  default: ormconfig,
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
  // await prepareConnection();
  // return getConnectionManager().get('default').getRepository(entity);

  const connection = await ensureConnection();
  return connection.getRepository(entity);
};
