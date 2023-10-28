import type {
  CustomerDashboardData,
  CustomerWithTotalOrders,
} from 'backend/services/customer/helper';
import type { JSSuccess } from 'backend/types/jsend';
import axiosInstance from 'constants/axiosFe.constant';
import {
  CUSTOMERS_API_STAFF_ROUTE,
  CUSTOMER_DETAIL_API_STAFF_ROUTE,
  SUPPLIERS_API_STAFF_ROUTE,
} from 'constants/routes.api.constant';
import { convertToPaginationResult } from 'helpers/pagination.help';
import type { GetAllPaginationResult } from 'types/pagination';
import { insertId } from 'utils/middleware.helper';

const getCustomers = async (
  page: number,
): Promise<GetAllPaginationResult<CustomerWithTotalOrders>> => {
  const response = await axiosInstance.get<
    JSSuccess<CustomerWithTotalOrders[]>
  >(CUSTOMERS_API_STAFF_ROUTE, {
    params: {
      page,
    },
  });

  return convertToPaginationResult(response);
};

const getCustomer = async (
  customerId: string,
): Promise<CustomerDashboardData> => {
  const response = await axiosInstance.get(
    insertId(CUSTOMER_DETAIL_API_STAFF_ROUTE, customerId),
  );
  return response.data.data;
};

const searchCustomersByName = async (
  searchQuery: string,
): Promise<CustomerWithTotalOrders[]> => {
  if (!searchQuery) return [];
  const response = await axiosInstance.get(SUPPLIERS_API_STAFF_ROUTE, {
    params: {
      name: searchQuery,
    },
  });

  const result = response.data.data;
  if (!result) return [];
  return result;
};

const staffCustomerCaller = {
  getCustomers,
  getCustomer,
  searchCustomersByName,
};

export default staffCustomerCaller;
