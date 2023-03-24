import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import type { GetAllPaginationResult } from 'api/types/pagination.type';
import axiosInstance from 'utils/axiosInstance';
import { OrderPaginationConstant } from 'utils/constants';

export const getOrders = async (
  accountId: string,
  page: number,
): Promise<GetAllPaginationResult<ICustomerOrder>> => {
  const response = await axiosInstance.get(`profile/order/${accountId}`, {
    params: {
      docsPerPage: OrderPaginationConstant.docsPerPage,
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
  const response = await axiosInstance.put(`profile/order/cancel`, {
    id: orderId,
  });
  return response.data.data;
};

const apiCaller = {
  getOrders,
  getOrder,
  cancelOrder,
};

export default apiCaller;
