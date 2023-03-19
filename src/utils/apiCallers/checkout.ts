import type { DeliveryInfo } from 'api/helpers/address.helper';
import axiosInstance from 'utils/axiosInstance';

export const getShippingInfo = async (
  address1: string,
  address2: string,
): Promise<DeliveryInfo> => {
  const response = await axiosInstance.get(`/distance`, {
    params: {
      address1,
      address2,
    },
  });
  return response.data.data;
};

const apiCaller = {
  getDeliveryInfo: getShippingInfo,
};

export default apiCaller;
