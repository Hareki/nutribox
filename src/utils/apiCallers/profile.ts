import type { IAccount } from 'api/models/Account.model/types';
import type { JSendSuccessResponse } from 'api/types/response.type';
import axiosInstance from 'utils/axiosInstance';

export const getAccount = async (
  accountId: string,
): Promise<JSendSuccessResponse<IAccount>> => {
  const response = await axiosInstance.get(`/profile/${accountId}`);
  return response.data.data;
};

// export const updateAccount = async (

const apiCaller = {
  getAccount,
};

export default apiCaller;
