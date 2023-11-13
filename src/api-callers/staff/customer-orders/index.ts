import type { CustomerCancelOrderDto } from 'backend/dtos/profile/orders/cancelOrder.dto';
import type { ExportOrderDetails } from 'backend/services/customerOrder/helper';
import type { JSSuccess } from 'backend/types/jsend';
import axiosInstance from 'constants/axiosFe.constant';
import {
  CUSTOMER_ORDERS_API_STAFF_ROUTE,
  CUSTOMER_ORDER_DETAIL_API_STAFF_ROUTE,
  EXPORT_ORDER_DETAIL_API_STAFF_ROUTE,
} from 'constants/routes.api.constant';
import { convertToPaginationResult } from 'helpers/pagination.help';
import type {
  CustomerOrderModel,
  PopulateCustomerOrderFields,
} from 'models/customerOrder.model';
import type { GetAllPaginationResult } from 'types/pagination';
import { insertId } from 'utils/middleware.helper';

const getOrders = async (
  page: number,
): Promise<GetAllPaginationResult<CustomerOrderModel>> => {
  const response = await axiosInstance.get(CUSTOMER_ORDERS_API_STAFF_ROUTE, {
    params: {
      page,
    },
  });
  return convertToPaginationResult(response);
};

const getOrder = async (
  customerOrderId: string,
): Promise<PopulateCustomerOrderFields<'customerOrderItems'>> => {
  const response = await axiosInstance.get(
    insertId(CUSTOMER_ORDER_DETAIL_API_STAFF_ROUTE, customerOrderId),
  );
  return response.data.data;
};

const getExportOrderDetails = async (
  customerOrderId: string,
): Promise<ExportOrderDetails[]> => {
  const response = await axiosInstance.get<JSSuccess<ExportOrderDetails[]>>(
    insertId(EXPORT_ORDER_DETAIL_API_STAFF_ROUTE, customerOrderId),
  );
  return response.data.data;
};

const upgradeOrderStatus = async (
  orderId: string,
): Promise<PopulateCustomerOrderFields<'customerOrderItems'>> => {
  const response = await axiosInstance.put(
    insertId(CUSTOMER_ORDER_DETAIL_API_STAFF_ROUTE, orderId),
  );
  return response.data.data;
};

const searchOrdersById = async (
  searchQuery: string,
): Promise<CustomerOrderModel[]> => {
  if (!searchQuery) return [];
  const response = await axiosInstance.get(CUSTOMER_ORDERS_API_STAFF_ROUTE, {
    params: {
      keyword: searchQuery,
    },
  });

  const result = response.data.data;
  if (!result) return [];
  return result;
};

const cancelOrder = async (
  orderId: string,
  dto: CustomerCancelOrderDto,
): Promise<PopulateCustomerOrderFields<'customerOrderItems'>> => {
  const response = await axiosInstance.patch(
    insertId(CUSTOMER_ORDER_DETAIL_API_STAFF_ROUTE, orderId),
    dto,
  );
  return response.data.data;
};

const staffCustomerOrderCaller = {
  getOrders,
  getOrder,
  upgradeOrderStatus,
  cancelOrder,
  searchOrdersById,
  getExportOrderDetails,
};

export default staffCustomerOrderCaller;
