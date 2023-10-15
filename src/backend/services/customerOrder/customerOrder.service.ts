/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  getFullAddress,
  type EstimatedDeliveryInfo,
  getEstimatedDeliveryInfo,
} from '../../utils/address.helper';
import { CommonService } from '../common/common.service';

import type { CheckoutValidation } from './helper';

import { StoreEntity } from 'backend/entities/store.entity';
import {
  MAX_DELIVERY_DURATION,
  MAX_DELIVERY_RANGE,
} from 'constants/delivery.constants';
import type { PopulateStoreFields } from 'models/store.model';
import type { StoreWorkTimeModel } from 'models/storeWorkTime.model';
import { getDayOfWeek, isTimeWithinRange } from 'utils/date.helper';

export class CustomerOrderService {
  private static async _getEstimatedDeliveryInfo(
    storeAddress: string,
    customerAddress: string,
  ): Promise<EstimatedDeliveryInfo> {
    const validDummyInfo: EstimatedDeliveryInfo = {
      distance: 9.44,
      durationInTraffic: 4.123,
      heavyTraffic: true,
    };

    const invalidDummyInfo: EstimatedDeliveryInfo = {
      distance: 8,
      durationInTraffic: 50,
      heavyTraffic: true,
    };

    // const estimatedDeliveryInfo = await getEstimatedDeliveryInfo(
    //   storeAddress,
    //   customerAddress,
    // );
    // return estimatedDeliveryInfo;

    return invalidDummyInfo;
  }

  public static async getCheckoutValidation(
    customerAddress: string,
  ): Promise<CheckoutValidation> {
    const store = (await CommonService.getRecord({
      entity: StoreEntity,
      filter: { id: 'ce78d779-98f5-5b55-9ee3-926739703cc7' },
      relations: ['storeWorkTimes'],
    })) as PopulateStoreFields<'storeWorkTimes'>;

    const storeAddress = await getFullAddress(store);

    const estimatedDeliveryInfo = await this._getEstimatedDeliveryInfo(
      storeAddress,
      customerAddress,
    );

    const todayWorkTime = store.storeWorkTimes.find(
      (workTime) => workTime.dayOfWeek === getDayOfWeek(new Date().getDay()),
    ) as StoreWorkTimeModel;

    const isValidTime = isTimeWithinRange(
      new Date(),
      todayWorkTime.openTime,
      todayWorkTime.closeTime,
    );
    const isValidDistance =
      estimatedDeliveryInfo.distance <= MAX_DELIVERY_RANGE;
    const isValidDuration =
      estimatedDeliveryInfo.durationInTraffic <= MAX_DELIVERY_DURATION;

    return {
      isValidTime,
      isValidDistance,
      isValidDuration,
      estimatedDeliveryInfo,
    };
  }
}
