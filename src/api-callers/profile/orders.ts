import type { CustomerCancelOrderDto } from 'backend/dtos/profile/orders/cancelOrder.dto';
import type { JSSuccess } from 'backend/types/jsend';
import axiosInstance from 'constants/axiosFe.constant';
import { ORDERS_API_ROUTE } from 'constants/routes.api.constant';
import { ORDERS_DETAIL_STAFF_ROUTE } from 'constants/routes.ui.constant';
import type { CustomerOrderModel } from 'models/customerOrder.model';
import type { PaginatedResponse } from 'types/pagination';
import { insertId } from 'utils/middleware.helper';

export const getOrders = async (
  page: number,
): Promise<PaginatedResponse<CustomerOrderModel>> => {
  const response = await axiosInstance.get<
    JSSuccess<PaginatedResponse<CustomerOrderModel>>
  >(ORDERS_API_ROUTE, {
    params: {
      page,
    },
  });
  return response.data.data;
};

export const getOrder = async (
  orderId: string,
): Promise<CustomerOrderModel> => {
  const response = await axiosInstance.get(
    insertId(ORDERS_DETAIL_STAFF_ROUTE, orderId),
  );
  return response.data.data;
};

export const cancelOrder = async (
  orderId: string,
  dto: CustomerCancelOrderDto,
): Promise<CustomerOrderModel> => {
  const response = await axiosInstance.patch(
    insertId(ORDERS_DETAIL_STAFF_ROUTE, orderId),
    dto,
  );
  return response.data.data;
};

// TODO: This is old, not updated yet, since we don't implement this feature yet
export const updateOrderStatus = async (
  orderId: string,
): Promise<CustomerOrderModel> => {
  // const requestBody: UpdateOrderStatusRb = {
  //   id: orderId,
  // };
  // const response = await axiosInstance.put(`admin/order/update`, requestBody);
  // return response.data.data;
  return undefined as any;
};

const orderCaller = {
  getOrders,
  getOrder,
  cancelOrder,
  updateOrderStatus,
};

export default orderCaller;
