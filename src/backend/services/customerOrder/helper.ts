import type { EstimatedDeliveryInfo } from 'backend/utils/address.helper';

export type CheckoutValidation = {
  isValidTime: boolean;
  isValidDistance: boolean;
  isValidDuration: boolean;
  estimatedDeliveryInfo: EstimatedDeliveryInfo;
};
