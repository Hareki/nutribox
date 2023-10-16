import type { CheckoutRequestBody } from '../../../pages/api/checkout';

import type { DeliveryInfo } from 'api/helpers/address.helper';
import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import axiosInstance from 'constants/axiosFe.constant';

export const getDeliveryInfo = async (
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

export const completeOrder = async (
  requestBody: CheckoutRequestBody,
): Promise<ICustomerOrder> => {
  console.log('file: checkout.ts:23 - requestBody:', requestBody);
  const response = await axiosInstance.post('/checkout', requestBody);
  return response.data.data;
};

const apiCaller = {
  getDeliveryInfo,
  completeOrder,
};

export default apiCaller;
