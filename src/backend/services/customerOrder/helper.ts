import type { EstimatedDeliveryInfo } from 'backend/helpers/address.helper';

export type CheckoutValidation = {
  isValidTime: boolean;
  isValidDistance: boolean;
  isValidDuration: boolean;
  estimatedDeliveryInfo: EstimatedDeliveryInfo;
};
