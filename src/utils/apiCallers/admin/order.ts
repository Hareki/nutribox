import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import type { GetAllPaginationResult } from 'api/types/pagination.type';
import axiosInstance from 'utils/axiosInstance';
import { AdminMainTablePaginationConstant } from 'utils/constants';

export const getOrders = async (
  page: number,
): Promise<GetAllPaginationResult<ICustomerOrder>> => {
  const response = await axiosInstance.get(`admin/order/all`, {
    params: {
      docsPerPage: AdminMainTablePaginationConstant.docsPerPage,
      page,
    },
  });
  return response.data.data;
};

export const getOrder = async (orderId: string): Promise<ICustomerOrder> => {
  const response = await axiosInstance.get(`admin/order/detail/${orderId}`);
  return response.data.data;
};

export const updateOrder = async (orderId: string): Promise<ICustomerOrder> => {
  const response = await axiosInstance.put(`admin/order/update`, {
    id: orderId,
  });
  return response.data.data;
};

const apiCaller = {
  getOrders,
  getOrder,
  updateOrder,
};

export default apiCaller;
