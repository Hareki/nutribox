/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Repository } from 'typeorm';
import { MoreThan, getManager } from 'typeorm';

import {
  getFullAddress,
  type EstimatedDeliveryInfo,
} from '../../helpers/address.helper';
import { CommonService } from '../common/common.service';

import type { CheckoutValidation } from './helper';

import type { CheckoutDto } from 'backend/dtos/checkout.dto';
import type { CustomerCancelOrderDto } from 'backend/dtos/profile/orders/cancelOrder.dto';
import { CartItemEntity } from 'backend/entities/cartItem.entity';
import { CustomerOrderEntity } from 'backend/entities/customerOrder.entity';
import { CustomerOrderItemEntity } from 'backend/entities/customerOrderItem.entity';
import { ExportOrderEntity } from 'backend/entities/exportOrder.entity';
import { ImportOrderEntity } from 'backend/entities/importOrder.entity';
import { ProductEntity } from 'backend/entities/product.entity';
import { StoreEntity } from 'backend/entities/store.entity';
import { OrderStatus } from 'backend/enums/entities.enum';
import {
  MAX_DELIVERY_DURATION,
  MAX_DELIVERY_RANGE,
} from 'constants/delivery.constant';
import type { CustomerOrderModel } from 'models/customerOrder.model';
import type { PopulateCustomerOrderItemIdFields } from 'models/customerOrderItem.model';
import type { ExportOrderModel } from 'models/exportOrder.model';
import type { PopulateStoreFields } from 'models/store.model';
import type { StoreWorkTimeModel } from 'models/storeWorkTime.model';
import { getDayOfWeek, isTimeWithinRange } from 'utils/date.helper';

export class CustomerOrderService {
  private static async _getEstimatedDeliveryInfo(
    storeAddress: string,
    customerAddress: string,
  ): Promise<EstimatedDeliveryInfo> {
    const validDummyInfo: EstimatedDeliveryInfo = {
      distance: 9.44,
      durationInTraffic: 4.123,
      heavyTraffic: true,
    };

    const invalidDummyInfo: EstimatedDeliveryInfo = {
      distance: 12,
      durationInTraffic: 50,
      heavyTraffic: true,
    };

    // const estimatedDeliveryInfo = await getEstimatedDeliveryInfo(
    //   storeAddress,
    //   customerAddress,
    // );
    // return estimatedDeliveryInfo;

    // return invalidDummyInfo;
    return validDummyInfo;
  }

  public static async getCheckoutValidation(
    customerAddress: string,
  ): Promise<CheckoutValidation> {
    const store = (await CommonService.getRecord({
      entity: StoreEntity,
      filter: { id: 'ce78d779-98f5-5b55-9ee3-926739703cc7' },
      relations: ['storeWorkTimes'],
    })) as PopulateStoreFields<'storeWorkTimes'>;

    const storeAddress = await getFullAddress(store);

    const estimatedDeliveryInfo = await this._getEstimatedDeliveryInfo(
      storeAddress,
      customerAddress,
    );

    const todayWorkTime = store.storeWorkTimes.find(
      (workTime) => workTime.dayOfWeek === getDayOfWeek(new Date().getDay()),
    ) as StoreWorkTimeModel;

    const isValidTime = isTimeWithinRange(
      new Date(),
      todayWorkTime.openTime,
      todayWorkTime.closeTime,
    );
    const isValidDistance =
      estimatedDeliveryInfo.distance <= MAX_DELIVERY_RANGE;
    const isValidDuration =
      estimatedDeliveryInfo.durationInTraffic <= MAX_DELIVERY_DURATION;

    return {
      customerAddress,
      storeAddress,
      isValidTime,
      isValidDistance,
      isValidDuration,
      estimatedDeliveryInfo,
    };
  }

  private static async _createCustomerOrder(
    dto: CheckoutDto,
    updatedBy: string,
    estimatedDeliveryInfo: EstimatedDeliveryInfo,
    customerOrderRepo: Repository<CustomerOrderEntity>,
  ): Promise<CustomerOrderEntity> {
    const newOrder: Partial<CustomerOrderEntity> = {
      ...dto,
      profit: 0,
      total: 0,
      status: OrderStatus.PENDING,
      estimatedDeliveryTime: new Date(
        Date.now() + estimatedDeliveryInfo.durationInTraffic * 60 * 1000,
      ),
      estimatedDistance: estimatedDeliveryInfo.distance,
      updatedBy,
    };

    return CommonService.createRecord(
      CustomerOrderEntity,
      newOrder,
      customerOrderRepo,
    );
  }

  private static async _createCustomerOrderItem(
    customerOrderId: string,
    cartItemId: string,
    customerOrderItemRepo: Repository<CustomerOrderItemEntity>,
    productRepo: Repository<ProductEntity>,
    cartItemRepo: Repository<CartItemEntity>,
  ): Promise<CustomerOrderItemEntity> {
    const cartItem = await CommonService.getRecord(
      {
        entity: CartItemEntity,
        filter: { id: cartItemId },
      },
      cartItemRepo,
    );

    const product = await CommonService.getRecord(
      {
        entity: ProductEntity,
        filter: { id: cartItem.product as string },
      },
      productRepo,
    );

    return CommonService.createRecord(
      CustomerOrderItemEntity,
      {
        customerOrder: {
          id: customerOrderId,
        },
        product: {
          id: product.id,
        },
        unitRetailPrice: product.retailPrice,
        quantity: cartItem.quantity,
      },
      customerOrderItemRepo,
    );
  }

  private static async _createExportOrder(
    orderItem: PopulateCustomerOrderItemIdFields<'product'>,
    importOrderRepo: Repository<ImportOrderEntity>,
    exportOrderRepo: Repository<ExportOrderEntity>,
  ): Promise<void> {
    let quantityToExport = orderItem.quantity;

    // Fetch all potential import orders
    const [availableImportOrders] = await CommonService.getRecords(
      {
        entity: ImportOrderEntity,
        filter: {
          product: {
            id: orderItem.product.id,
          },
          remainingQuantity: MoreThan(0),
          expirationDate: MoreThan(new Date()),
        },
        order: {
          expirationDate: 'ASC',
        },
      },
      importOrderRepo,
    );

    for (const importOrder of availableImportOrders) {
      if (quantityToExport <= 0) break;

      const exportableQuantity = Math.min(
        importOrder.remainingQuantity,
        quantityToExport,
      );

      const result = await CommonService.createRecord(
        ExportOrderEntity,
        {
          importOrder: {
            id: importOrder.id,
          },
          customerOrderItem: {
            id: orderItem.id,
          },
          quantity: exportableQuantity,
        },
        exportOrderRepo,
      );

      await CommonService.updateRecord(
        ImportOrderEntity,
        importOrder.id,
        {
          remainingQuantity: importOrder.remainingQuantity - exportableQuantity,
        },
        importOrderRepo,
      );

      quantityToExport -= exportableQuantity;
    }

    if (quantityToExport > 0) {
      throw new Error('Insufficient stock or no valid import order found');
    }
  }

  private static async _calculateProfitForOrderItem(
    orderItem: PopulateCustomerOrderItemIdFields<'product'>,
    importOrderRepo: Repository<ImportOrderEntity>,
    exportOrderRepo: Repository<ExportOrderEntity>,
  ): Promise<number> {
    let totalImportCost = 0;

    const [relatedExportOrders] = await CommonService.getRecords(
      {
        entity: ExportOrderEntity,
        filter: {
          customerOrderItem: {
            id: orderItem.id,
          },
        },
      },
      exportOrderRepo,
    );

    for (const exportOrder of relatedExportOrders) {
      const relatedImportOrder = await CommonService.getRecord(
        {
          entity: ImportOrderEntity,
          filter: { id: exportOrder.importOrder as string },
        },
        importOrderRepo,
      );
      totalImportCost +=
        relatedImportOrder.unitImportPrice * exportOrder.quantity;
    }

    const profit =
      orderItem.unitRetailPrice * orderItem.quantity - totalImportCost;
    return profit;
  }

  public static async checkout(
    dto: CheckoutDto,
    customerId: string,
    checkoutValidation: CheckoutValidation,
  ): Promise<CustomerOrderModel> {
    const transactionalEntityManager = getManager();

    let result: CustomerOrderModel;
    await transactionalEntityManager.transaction(async (transactionalEM) => {
      const customerOrderItemRepo = transactionalEM.getRepository(
        CustomerOrderItemEntity,
      );
      const cartItemRepo = transactionalEM.getRepository(CartItemEntity);
      const customerOrderRepo =
        transactionalEM.getRepository(CustomerOrderEntity);
      const importOrderRepo = transactionalEM.getRepository(ImportOrderEntity);
      const exportOrderRepo = transactionalEM.getRepository(ExportOrderEntity);
      const productRepo = transactionalEM.getRepository(ProductEntity);

      const customerOrder = await this._createCustomerOrder(
        dto,
        customerId,
        checkoutValidation.estimatedDeliveryInfo,
        customerOrderRepo,
      );
      let totalProfit = 0;

      for (const cartItem of dto.cartItems) {
        const orderItem = (await this._createCustomerOrderItem(
          customerOrder.id,
          cartItem,
          customerOrderItemRepo,
          productRepo,
          cartItemRepo,
        )) as PopulateCustomerOrderItemIdFields<'product'>;

        await CommonService.deleteRecord(
          CartItemEntity,
          cartItem,
          cartItemRepo,
        );

        await this._createExportOrder(
          orderItem,
          importOrderRepo,
          exportOrderRepo,
        );

        const profitForItem = await this._calculateProfitForOrderItem(
          orderItem,
          importOrderRepo,
          exportOrderRepo,
        );
        totalProfit += profitForItem;
      }

      customerOrder.profit = totalProfit;

      result = (await CommonService.updateRecord(
        CustomerOrderEntity,
        customerOrder.id,
        customerOrder,
        customerOrderRepo,
      )) as CustomerOrderModel;
    });

    return result!;
  }

  private static async _refundsProduct(
    customerOrderId: string,
    customerOrderItemRepo: Repository<CustomerOrderItemEntity>,
    exportOrderRepo: Repository<ExportOrderEntity>,
    importOrderRepo: Repository<ImportOrderEntity>,
  ): Promise<void> {
    const [customerOrderItems] = await CommonService.getRecords(
      {
        entity: CustomerOrderItemEntity,
        filter: { customerOrder: customerOrderId },
      },
      customerOrderItemRepo,
    );

    for (const orderItem of customerOrderItems) {
      const [exportOrders] = await CommonService.getRecords(
        {
          entity: ExportOrderEntity,
          filter: { customerOrderItem: orderItem.id },
        },
        exportOrderRepo,
      );

      for (const exportOrder of exportOrders as ExportOrderModel[]) {
        const importOrder = await CommonService.getRecord(
          {
            entity: ImportOrderEntity,
            filter: { id: exportOrder.importOrder },
          },
          importOrderRepo,
        );

        importOrder.remainingQuantity += exportOrder.quantity;
        await CommonService.updateRecord(
          ImportOrderEntity,
          importOrder.id,
          importOrder,
          importOrderRepo,
        );
      }
    }
  }

  public static async cancelOrder(
    customerOrderId: string,
    updatedBy: string,
    dto: CustomerCancelOrderDto,
  ): Promise<CustomerOrderModel> {
    const transactionalEntityManager = getManager();
    let updatedOrder: CustomerOrderModel | undefined = undefined;

    await transactionalEntityManager.transaction(async (transactionalEM) => {
      const customerOrderRepo: Repository<CustomerOrderEntity> =
        transactionalEM.getRepository(CustomerOrderEntity);
      const customerOrderItemRepo: Repository<CustomerOrderItemEntity> =
        transactionalEM.getRepository(CustomerOrderItemEntity);
      const exportOrderRepo: Repository<ExportOrderEntity> =
        transactionalEM.getRepository(ExportOrderEntity);
      const importOrderRepo: Repository<ImportOrderEntity> =
        transactionalEM.getRepository(ImportOrderEntity);

      updatedOrder = (await CommonService.updateRecord(
        CustomerOrderEntity,
        customerOrderId,
        {
          status: OrderStatus.CANCELLED,
          cancellationReason: dto.cancellationReason,
          updatedBy,
        },
        customerOrderRepo,
      )) as CustomerOrderModel;

      this._refundsProduct(
        customerOrderId,
        customerOrderItemRepo,
        exportOrderRepo,
        importOrderRepo,
      );
    });

    return updatedOrder!;
  }
}