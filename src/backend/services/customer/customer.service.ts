import { Not } from 'typeorm';

import { CommonService } from '../common/common.service';

import type { OrderStatusCount, DashboardInfo } from './helper';

import type { NewCustomerAddressDto } from 'backend/dtos/profile/addresses/newCustomerAddress.dto';
import type { UpdateProfileDto } from 'backend/dtos/profile/profile.dto';
import { CustomerEntity } from 'backend/entities/customer.entity';
import { CustomerAddressEntity } from 'backend/entities/customerAddress.entity';
import { CustomerOrderEntity } from 'backend/entities/customerOrder.entity';
import { OrderStatus } from 'backend/enums/entities.enum';
import { getRepo } from 'backend/utils/database.helper';
import { isEntityNotFoundError } from 'backend/utils/validation.helper';
import type { CustomerModel } from 'models/customer.model';
import type { CustomerAddressModel } from 'models/customerAddress.model';

export class CustomerService {
  private static async _getOrderStatusCount(
    customerId: string,
  ): Promise<OrderStatusCount> {
    const orderRepository = await getRepo(CustomerOrderEntity);

    const results = await orderRepository
      .createQueryBuilder('order')
      .select('COUNT(*)', 'total')
      .addSelect(
        `SUM(CASE WHEN order.status = '${OrderStatus.PENDING}' THEN 1 ELSE 0 END)`,
        'pending',
      )
      .addSelect(
        `SUM(CASE WHEN order.status = '${OrderStatus.PROCESSING}' THEN 1 ELSE 0 END)`,
        'processing',
      )
      .addSelect(
        `SUM(CASE WHEN order.status = '${OrderStatus.SHIPPING}' THEN 1 ELSE 0 END)`,
        'shipping',
      )
      .addSelect(
        `SUM(CASE WHEN order.status = '${OrderStatus.SHIPPED}' THEN 1 ELSE 0 END)`,
        'shipped',
      )
      .where('order.customer = :customerId', { customerId })
      .getRawOne();

    return {
      total: parseInt(results.total),
      pending: parseInt(results.pending),
      processing: parseInt(results.processing),
      shipping: parseInt(results.shipping),
      shipped: parseInt(results.shipped),
    };
  }

  private static async _setFirstAddressAsDefault(
    id: string,
    customerId: string,
  ) {
    try {
      const firstAddress = await CommonService.getRecord({
        entity: CustomerAddressEntity,
        filter: {
          id: Not(id),
          customer: { id: customerId },
        },
      });

      await CommonService.updateRecord(CustomerAddressEntity, firstAddress.id, {
        isDefault: true,
      });
    } catch (error) {
      if (!isEntityNotFoundError(error)) {
        throw error;
      }
    }
  }

  private static async _setOtherAddressesAsNotDefault(
    id: string,
    customerId: string,
  ) {
    const [addresses] = await CommonService.getRecords({
      entity: CustomerAddressEntity,
      filter: {
        customer: { id: customerId },
      },
    });

    const addressNeedUpdate = addresses.find(
      (address) => address.id !== id && address.isDefault,
    );
    if (addressNeedUpdate) {
      await CommonService.updateRecord(
        CustomerAddressEntity,
        addressNeedUpdate.id,
        {
          isDefault: false,
        },
      );
    }
  }

  public static async getDashboardInfo(id: string): Promise<DashboardInfo> {
    const customer = (await CommonService.getRecord({
      entity: CustomerEntity,
      filter: { id },
    })) as CustomerModel;

    const orderStatusCount = await this._getOrderStatusCount(id);
    return {
      ...customer,
      orderStatusCount,
    };
  }

  public static async updateProfile(
    id: string,
    dto: UpdateProfileDto,
  ): Promise<CustomerModel> {
    const updatedCustomer = (await CommonService.updateRecord(
      CustomerEntity,
      id,
      dto,
    )) as CustomerModel;

    return updatedCustomer;
  }

  public static async getAddresses(
    id: string,
  ): Promise<CustomerAddressModel[]> {
    const [customerAddresses] = await CommonService.getRecords({
      entity: CustomerAddressEntity,
      filter: {
        customer: { id },
      },
    });

    return customerAddresses as CustomerAddressModel[];
  }

  public static async addAddress(
    customerId: string,
    dto: NewCustomerAddressDto,
  ): Promise<CustomerAddressModel> {
    const address = (await CommonService.createRecord(CustomerAddressEntity, {
      ...dto,
      customer: { id: customerId },
    })) as CustomerAddressModel;

    if (address.isDefault) {
      this._setOtherAddressesAsNotDefault(address.id, customerId);
    }

    return address;
  }

  public static async updateAddress(
    id: string,
    customerId: string,
    dto: NewCustomerAddressDto,
  ): Promise<CustomerAddressModel> {
    const wasDefault = await CommonService.getRecord({
      entity: CustomerAddressEntity,
      filter: { id },
    }).then((address) => address.isDefault);

    const address = (await CommonService.updateRecord(
      CustomerAddressEntity,
      id,
      dto,
    )) as CustomerAddressModel;

    if (wasDefault && !address.isDefault) {
      this._setFirstAddressAsDefault(id, customerId);
    } else if (!wasDefault && address.isDefault) {
      this._setOtherAddressesAsNotDefault(id, customerId);
    }

    return address;
  }

  public static async deleteAddress(
    id: string,
    customerId: string,
  ): Promise<void> {
    const address = await CommonService.getRecord({
      entity: CustomerAddressEntity,
      filter: { id },
    });

    if (address.isDefault) {
      this._setFirstAddressAsDefault(id, customerId);
    }

    await CommonService.deleteRecord(CustomerAddressEntity, id);
  }
}
