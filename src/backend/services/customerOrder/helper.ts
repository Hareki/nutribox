import type { EstimatedDeliveryInfo } from 'backend/helpers/address.helper';

export type CheckoutValidation = {
  customerAddress: string;
  storeAddress: string;
  isValidTime: boolean;
  isValidDistance: boolean;
  isValidDuration: boolean;
  estimatedDeliveryInfo: EstimatedDeliveryInfo;
};
