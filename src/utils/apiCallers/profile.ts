import type { UpdateAccountRequestBody } from '../../../pages/api/profile/[id]';

import type { IAccount } from 'api/models/Account.model/types';
import type { JSendResponse } from 'api/types/response.type';
import axiosInstance from 'utils/axiosInstance';

export const getAccount = async (accountId: string): Promise<IAccount> => {
  const response = await axiosInstance.get(`/profile/${accountId}`);
  // console.log('file: profile.ts:10 - getAccount - response:', response);
  return response.data.data;
};

export const updateAccount = async (
  accountId: string,
  { firstName, lastName, birthday, phone, avatarUrl }: UpdateAccountRequestBody,
): Promise<JSendResponse<IAccount>> => {
  const response = await axiosInstance.put(`/profile/${accountId}`, {
    firstName,
    lastName,
    birthday,
    phone,
    avatarUrl,
  });
  return response.data;
};

const apiCaller = {
  getAccount,
  updateAccount,
};

export default apiCaller;
