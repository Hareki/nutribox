import type { ProfileMenuCount } from '../../../../pages/api/profile/menu-count';

import axiosInstance from 'constants/axiosFe.constant';

export const countAddressAndOrder = async (
  accountId: string,
): Promise<ProfileMenuCount> => {
  const response = await axiosInstance.get(`profile/menu-count`, {
    params: { id: accountId },
  });
  return response.data.data;
};

const apiCaller = {
  countAddressAndOrder,
};

export default apiCaller;
