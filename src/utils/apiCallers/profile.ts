import { IAccount } from 'api/models/Account.model/types';
import { JSendSuccessResponse } from 'api/types/response.type';
import axiosInstance from 'utils/axiosInstance';

export const getAccount = async (
  accountId: string,
): Promise<JSendSuccessResponse<IAccount>> => {
  const response = await axiosInstance.get(`/profile/${accountId}`);
  return response.data.data;
};
const apiCaller = {
  getAccount,
};

export default apiCaller;
