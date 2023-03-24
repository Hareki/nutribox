import type { ProfileCount } from '../../../../pages/api/profile/count';

import axiosInstance from 'utils/axiosInstance';

export const countAddressAndOrder = async (
  accountId: string,
): Promise<ProfileCount> => {
  const response = await axiosInstance.get(`profile/count`, {
    params: { id: accountId },
  });
  return response.data.data;
};

const apiCaller = {
  countAddressAndOrder,
};

export default apiCaller;
