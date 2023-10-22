import type { ConnectionOptions } from 'typeorm-seeding';

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
import { SnakeNamingStrategy } from 'backend/helpers/snakeCaseNamingStrategy.helper';

const config: ConnectionOptions = {
  name: 'default',
  type: 'postgres',
  host: process.env.DB_HOST,
  ssl: process.env.NODE_ENV === 'production' ? true : false,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [
    ProductEntity,
    AccountEntity,
    ProductImageEntity,
    CartItemEntity,
    CustomerEntity,
    CustomerAddressEntity,
    CustomerOrderEntity,
    CustomerOrderItemEntity,
    EmployeeEntity,
    ExportOrderEntity,
    ImportOrderEntity,
    ProductCategoryEntity,
    ReviewEntity,
    ReviewResponseEntity,
    StoreEntity,
    StoreWorkTimeEntity,
    SupplierEntity,
  ],
  // error: Cannot use import statement outside a module
  // reason NextJS configuration conflicts with TypeORM
  // entities: ['src/backend/entities/*{.ts,.js}'],
  seeds: ['src/backend/database/seeds/*{.ts,.js}'],
  factories: ['src/backend/database/factories/*{.ts,.js}'],
};

export default config;
