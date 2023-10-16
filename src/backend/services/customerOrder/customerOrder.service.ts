/* eslint-disable @typescript-eslint/no-unused-vars */
import { MoreThan, getManager } from 'typeorm';

import {
  getFullAddress,
  type EstimatedDeliveryInfo,
  getEstimatedDeliveryInfo,
} from '../../helpers/address.helper';
import { CommonService } from '../common/common.service';

import type { CheckoutValidation } from './helper';

import type { CheckoutDto } from 'backend/dtos/checkout.dto';
import { CartItemEntity } from 'backend/entities/cartItem.entity';
import { CustomerOrderEntity } from 'backend/entities/customerOrder.entity';
import { CustomerOrderItemEntity } from 'backend/entities/customerOrderItem.entity';
import { ExportOrderEntity } from 'backend/entities/exportOrder.entity';
import { ImportOrderEntity } from 'backend/entities/importOrder.entity';
import { ProductEntity } from 'backend/entities/product.entity';
import { StoreEntity } from 'backend/entities/store.entity';
import { OrderStatus } from 'backend/enums/entities.enum';
import { getRepo } from 'backend/helpers/database.helper';
import {
  MAX_DELIVERY_DURATION,
  MAX_DELIVERY_RANGE,
} from 'constants/delivery.constant';
import type { PopulateCartItemFields } from 'models/cartItem.model';
import type { CustomerOrderModel } from 'models/customerOrder.model';
import type {
  CustomerOrderItemModel,
  PopulateCustomerOrderItemFields,
  PopulateCustomerOrderItemIdFields,
} from 'models/customerOrderItem.model';
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
  ): Promise<CustomerOrderEntity> {
    const customerOrderRepo = await getRepo(CustomerOrderEntity);

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

    return customerOrderRepo.save(newOrder);
  }

  private static async _createCustomerOrderItem(
    customerOrderId: string,
    cartItemId: string,
  ): Promise<CustomerOrderItemEntity> {
    const customerOrderItemRepo = await getRepo(CustomerOrderItemEntity);
    const productRepo = await getRepo(ProductEntity);

    const cartItem = await CommonService.getRecord({
      entity: CartItemEntity,
      filter: { id: cartItemId },
    });

    const product = await productRepo.findOneOrFail(cartItem.product as string);

    const orderItem = customerOrderItemRepo.create({
      customerOrder: {
        id: customerOrderId,
      },
      product: {
        id: product.id,
      },
      unitRetailPrice: product.retailPrice,
      quantity: cartItem.quantity,
    });

    return customerOrderItemRepo.save(orderItem);
  }

  private static async _createExportOrder(
    orderItem: PopulateCustomerOrderItemIdFields<'product'>,
  ): Promise<void> {
    const importOrderRepo = await getRepo(ImportOrderEntity);
    const exportOrderRepo = await getRepo(ExportOrderEntity);

    let quantityToExport = orderItem.quantity;

    // Fetch all potential import orders
    const [availableImportOrders] = await CommonService.getRecords({
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
    });

    for (const importOrder of availableImportOrders) {
      if (quantityToExport <= 0) break;

      const exportableQuantity = Math.min(
        importOrder.remainingQuantity,
        quantityToExport,
      );

      await CommonService.createRecord(ExportOrderEntity, {
        importOrder: {
          id: importOrder.id,
        },
        customerOrderItem: {
          id: orderItem.id,
        },
        quantity: exportableQuantity,
      });

      importOrder.remainingQuantity -= exportableQuantity;
      await importOrderRepo.save(importOrder);

      quantityToExport -= exportableQuantity;
    }

    if (quantityToExport > 0) {
      throw new Error('Insufficient stock or no valid import order found');
    }
  }

  private static async _calculateProfitForOrderItem(
    orderItem: PopulateCustomerOrderItemIdFields<'product'>,
  ): Promise<number> {
    const exportOrderRepo = await getRepo(ExportOrderEntity);
    const importOrderRepo = await getRepo(ImportOrderEntity);

    let totalImportCost = 0;
    const relatedExportOrders = (await exportOrderRepo.find({
      customerOrderItem: orderItem,
    })) as ExportOrderModel[];

    for (const exportOrder of relatedExportOrders) {
      const relatedImportOrder = await importOrderRepo.findOneOrFail(
        exportOrder.importOrder,
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
      const customerOrder = await this._createCustomerOrder(
        dto,
        customerId,
        checkoutValidation.estimatedDeliveryInfo,
      );
      let totalProfit = 0;

      for (const cartItem of dto.cartItems) {
        const orderItem = (await this._createCustomerOrderItem(
          customerOrder.id,
          cartItem,
        )) as PopulateCustomerOrderItemIdFields<'product'>;

        await CommonService.deleteRecord(CartItemEntity, cartItem);

        await this._createExportOrder(orderItem);

        const profitForItem =
          await this._calculateProfitForOrderItem(orderItem);
        totalProfit += profitForItem;
      }

      customerOrder.profit = totalProfit;

      const customerOrderRepo =
        transactionalEM.getRepository(CustomerOrderEntity);
      result = (await customerOrderRepo.save(
        customerOrder,
      )) as CustomerOrderModel;
    });

    return result!;
  }
}
