import type {
  IAccount,
  IAccountWithTotalOrders,
} from 'api/models/Account.model/types';
import type { GetAllPaginationResult } from 'api/types/pagination.type';
import axiosInstance from 'constants/axiosFe.constant';
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

export const getAccount = async (accountId: string): Promise<IAccount> => {
  const response = await axiosInstance.get(`admin/account/${accountId}`);
  return response.data.data;
};

const searchAccountsByFullName = async (
  searchQuery: string,
): Promise<IAccountWithTotalOrders[]> => {
  if (!searchQuery) return [];
  const response = await axiosInstance.get('admin/account/search', {
    params: {
      fullName: searchQuery,
    },
  });

  const result = response.data.data;
  if (!result) return [];
  return result;
};

const apiCaller = {
  getAccounts,
  getAccount,
  searchAccountsByFullName,
};

export default apiCaller;
