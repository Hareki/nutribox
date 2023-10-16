import type { ProfileMenuCount } from 'backend/services/customer/helper';
import type { JSSuccess } from 'backend/types/jsend';
import axiosInstance from 'constants/axiosFe.constant';
import { MENU_COUNT_API_ROUTE } from 'constants/routes.api.constant';

export const countAddressAndOrder = async (): Promise<ProfileMenuCount> => {
  const response =
    await axiosInstance.get<JSSuccess<ProfileMenuCount>>(MENU_COUNT_API_ROUTE);
  return response.data.data;
};

const menuCountCaller = {
  countAddressAndOrder,
};

export default menuCountCaller;
