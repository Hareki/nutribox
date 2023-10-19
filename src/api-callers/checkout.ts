import type { CheckoutDto } from 'backend/dtos/checkout.dto';
import type { CheckoutValidation } from 'backend/services/customerOrder/helper';
import axiosInstance from 'constants/axiosFe.constant';
import {
  CHECKOUT_API_ROUTE,
  CHECKOUT_VALIDATION_API_ROUTE,
} from 'constants/routes.api.constant';
import type { CustomerOrderModel } from 'models/customerOrder.model';

export const getCheckoutValidation = async (
  address: string,
): Promise<CheckoutValidation> => {
  const response = await axiosInstance.get(CHECKOUT_VALIDATION_API_ROUTE, {
    params: {
      address,
    },
  });
  return response.data.data;
};

export const checkout = async (
  dto: CheckoutDto,
): Promise<CustomerOrderModel> => {
  const response = await axiosInstance.post(CHECKOUT_API_ROUTE, dto);
  return response.data.data;
};

const apiCaller = {
  getCheckoutValidation,
  checkout,
};

export default apiCaller;
