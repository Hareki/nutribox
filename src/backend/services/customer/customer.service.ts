import { CommonService } from '../common/common.service';

import type {
  OrderStatusCount,
  CustomerDashboardData,
  ProfileMenuCount,
} from './helper';

import type { UpdateProfileDto } from 'backend/dtos/profile/profile.dto';
import { CustomerEntity } from 'backend/entities/customer.entity';
import { CustomerAddressEntity } from 'backend/entities/customerAddress.entity';
import { CustomerOrderEntity } from 'backend/entities/customerOrder.entity';
import { OrderStatus } from 'backend/enums/entities.enum';
import { getRepo } from 'backend/helpers/database.helper';
import type { CommonCustomerModel, CustomerModel } from 'models/customer.model';

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
      .addSelect(
        `SUM(CASE WHEN order.status = '${OrderStatus.SHIPPED}' THEN 1 ELSE 0 END)`,
        'cancelled',
      )
      .where('order.customer = :customerId', { customerId })
      .getRawOne();

    return {
      total: parseInt(results.total),
      pending: parseInt(results.pending),
      processing: parseInt(results.processing),
      shipping: parseInt(results.shipping),
      shipped: parseInt(results.shipped),
      cancelled: parseInt(results.cancelled),
    };
  }

  public static async getCommonCustomer(
    id: string,
  ): Promise<CommonCustomerModel> {
    const queryBuilder = (await getRepo(CustomerEntity)).createQueryBuilder(
      'customer',
    );
    queryBuilder.leftJoinAndSelect('customer.account', 'account');
    queryBuilder.where('account.id = :id', { id });
    queryBuilder.leftJoinAndSelect('customer.cartItems', 'cartItems');
    queryBuilder.leftJoinAndSelect(
      'customer.customerAddresses',
      'customerAddresses',
    );

    const test = queryBuilder.getQueryAndParameters();
    const customer = (await queryBuilder.getOne()) as CommonCustomerModel;
    return customer;
  }

  public static async getDashboardInfo(
    id: string,
  ): Promise<CustomerDashboardData> {
    const customer = await this.getCommonCustomer(id);

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

  public static async getMenuCount(id: string): Promise<ProfileMenuCount> {
    const orderRepo = await getRepo(CustomerOrderEntity);
    const addressRepo = await getRepo(CustomerAddressEntity);

    const orderCount = await orderRepo.count({ customer: id });
    const addressCount = await addressRepo.count({ customer: id });

    return {
      orderCount,
      addressCount,
    };
  }
}
