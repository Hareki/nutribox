import type { CustomerCancelOrderDto } from 'backend/dtos/profile/orders/cancelOrder.dto';
import type { JSSuccess } from 'backend/types/jsend';
import axiosInstance from 'constants/axiosFe.constant';
import {
  ORDERS_API_ROUTE,
  ORDER_DETAIL_API_ROUTE,
} from 'constants/routes.api.constant';
import type {
  CustomerOrderModel,
  PopulateCustomerOrderFields,
} from 'models/customerOrder.model';
import type { GetInfinitePaginationResult } from 'types/pagination';
import { insertId } from 'utils/middleware.helper';

export const getOrders = async (
  page: number,
): Promise<GetInfinitePaginationResult<CustomerOrderModel>> => {
  const response = await axiosInstance.get<JSSuccess<CustomerOrderModel[]>>(
    ORDERS_API_ROUTE,
    {
      params: {
        page,
      },
    },
  );

  const nextPageNum = response.headers['x-next-page'];
  const totalDocs = response.headers['x-total-count'];

  return {
    docs: response.data.data,
    nextPageNum,
    totalDocs,
  };
};

export const getOrder = async (
  orderId: string,
): Promise<PopulateCustomerOrderFields<'customerOrderItems'>> => {
  const response = await axiosInstance.get(
    insertId(ORDER_DETAIL_API_ROUTE, orderId),
  );
  return response.data.data;
};

export const cancelOrder = async (
  orderId: string,
  dto: CustomerCancelOrderDto,
): Promise<PopulateCustomerOrderFields<'customerOrderItems'>> => {
  const response = await axiosInstance.patch(
    insertId(ORDER_DETAIL_API_ROUTE, orderId),
    dto,
  );
  return response.data.data;
};

const orderCaller = {
  getOrders,
  getOrder,
  cancelOrder,
};

export default orderCaller;
