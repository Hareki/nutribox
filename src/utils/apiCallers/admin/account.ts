import type {
  IAccount,
  IAccountWithTotalOrders,
} from 'api/models/Account.model/types';
import type { GetAllPaginationResult } from 'api/types/pagination.type';
import axiosInstance from 'utils/axiosInstance';
import { AdminMainTablePaginationConstant } from 'utils/constants';

export const getAccounts = async (
  page: number,
): Promise<GetAllPaginationResult<IAccountWithTotalOrders>> => {
  const response = await axiosInstance.get(`admin/account/all`, {
    params: {
      docsPerPage: AdminMainTablePaginationConstant.docsPerPage,
      page,
    },
  });
  return response.data.data;
};

export const getAccount = async (orderId: string): Promise<IAccount> => {
  const response = await axiosInstance.get(`admin/account/detail/${orderId}`);
  return response.data.data;
};

const apiCaller = {
  getAccounts,
  getAccount,
};

export default apiCaller;
