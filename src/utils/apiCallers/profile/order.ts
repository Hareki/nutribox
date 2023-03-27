import type { UpdateOrderStatusRb } from '../../../../pages/api/admin/order/update';
import type { CancelOrderRequestBody } from '../../../../pages/api/profile/order/cancel';

import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import type { GetAllPaginationResult } from 'api/types/pagination.type';
import axiosInstance from 'utils/axiosInstance';
import { ProfileOrderPaginationConstant } from 'utils/constants';

export const getOrders = async (
  accountId: string,
  page: number,
): Promise<GetAllPaginationResult<ICustomerOrder>> => {
  const response = await axiosInstance.get(`profile/order/${accountId}`, {
    params: {
      docsPerPage: ProfileOrderPaginationConstant.docsPerPage,
      page,
    },
  });
  return response.data.data;
};

export const getOrder = async (orderId: string): Promise<ICustomerOrder> => {
  const response = await axiosInstance.get(`profile/order/detail/${orderId}`);
  return response.data.data;
};

export const cancelOrder = async (orderId: string): Promise<ICustomerOrder> => {
  const requestBody: CancelOrderRequestBody = { id: orderId };
  const response = await axiosInstance.put(`profile/order/cancel`, requestBody);
  return response.data.data;
};

export const updateOrderStatus = async (
  orderId: string,
): Promise<ICustomerOrder> => {
  const requestBody: UpdateOrderStatusRb = {
    id: orderId,
  };
  const response = await axiosInstance.put(`admin/order/update`, requestBody);
  return response.data.data;
};

const apiCaller = {
  getOrders,
  getOrder,
  cancelOrder,
  updateOrderStatus,
};

export default apiCaller;
