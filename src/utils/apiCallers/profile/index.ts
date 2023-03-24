import type { UpdateAccountRequestBody } from '../../../../pages/api/profile/[id]';

import type { IAccount } from 'api/models/Account.model/types';
import axiosInstance from 'utils/axiosInstance';

// Assume it's a success response, because if it's not, it will get to the onError anyway
export const getAccount = async (accountId: string): Promise<IAccount> => {
  const response = await axiosInstance.get(`/profile/${accountId}`);
  return response.data.data;
};

export const updateAccount = async (
  accountId: string,
  { firstName, lastName, birthday, phone, avatarUrl }: UpdateAccountRequestBody,
): Promise<IAccount> => {
  const response = await axiosInstance.put(`/profile/${accountId}`, {
    firstName,
    lastName,
    birthday,
    phone,
    avatarUrl,
  });
  return response.data.data;
};

const apiCaller = {
  getAccount,
  updateAccount,
};

export default apiCaller;
