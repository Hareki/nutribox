import { differenceInMinutes } from 'date-fns';

import type { IStoreHour } from 'api/models/Store.model/StoreHour.schema/types';
import type { IStore } from 'api/models/Store.model/types';
import { Paragraph, Span } from 'components/abstract/Typography';
import type { InfoDialogAction } from 'components/dialog/info-dialog/reducer';
import {
  getDayOfWeekLabel,
  getStoreHoursLabel,
} from 'helpers/storeHours.helper';
import {
  compareTimes,
  getLocalTimeInVietnam,
  getTodaysDayOfWeekAllCaps,
} from 'lib';
import { MAX_DELIVERY_DURATION, MAX_DELIVERY_RANGE } from 'utils/constants';

export const checkTime = (
  dispatchInfo: (value: InfoDialogAction) => void,
  storeInfo: IStore,
): boolean => {
  const now = getLocalTimeInVietnam();
  const todayDayOfWeekAllCaps = getTodaysDayOfWeekAllCaps();
  const getTodayStoreHours: IStoreHour = storeInfo.storeHours.find(
    (item) => item.dayOfWeek === todayDayOfWeekAllCaps,
  );
  const todayOpenTime = new Date(getTodayStoreHours.openTime);
  const todayCloseTime = new Date(getTodayStoreHours.closeTime);
  const tooEarly = compareTimes(now, todayOpenTime) === -1;
  const tooLate = compareTimes(now, todayCloseTime) === 1;

  if (tooEarly || tooLate) {
    dispatchInfo({
      type: 'open_dialog',
      payload: {
        content: (
          <Paragraph>
            Chúng tôi chỉ giao hàng trong khoảng thời gian{' '}
            <Span fontWeight={600}>
              {getStoreHoursLabel(todayOpenTime, todayCloseTime)}
            </Span>{' '}
            vào ngày {getDayOfWeekLabel(todayDayOfWeekAllCaps).toLowerCase()},
            vui lòng quay lại sau.
          </Paragraph>
        ),
        title: 'Đã xảy ra lỗi',
        variant: 'error',
      },
    });
    return false;
  }
  return true;
};

export const checkCurrentFullAddress = (
  dispatchInfo: (value: InfoDialogAction) => void,
  currentFullAddress: string,
): boolean => {
  if (!currentFullAddress) {
    dispatchInfo({
      type: 'open_dialog',
      payload: {
        content: 'Vui lòng nhập đủ địa chỉ trước khi xem thời gian giao hàng',
        title: 'Đã xảy ra lỗi',
        variant: 'error',
      },
    });
    return false;
  }
  return true;
};

export const checkDistance = (
  dispatchInfo: (value: InfoDialogAction) => void,
  distance: number,
) => {
  if (distance > MAX_DELIVERY_RANGE) {
    dispatchInfo({
      type: 'open_dialog',
      payload: {
        content: (
          <Paragraph>
            Chúng tôi chỉ giao hàng trong bán kính{' '}
            <Span fontWeight={600}>{MAX_DELIVERY_RANGE} km</Span> tính từ chi
            nhánh gần nhất, vui lòng thử địa chỉ khác.
          </Paragraph>
        ),
        title: 'Đã xảy ra lỗi',
        variant: 'error',
      },
    });
    return false;
  }
  return true;
};

export const checkDuration = (
  dispatchInfo: (value: InfoDialogAction) => void,
  estimatedDeliverTime: Date,
) => {
  if (
    differenceInMinutes(estimatedDeliverTime, new Date()) >
    MAX_DELIVERY_DURATION
  ) {
    dispatchInfo({
      type: 'open_dialog',
      payload: {
        content: (
          <Paragraph>
            Do tình trạng giao thông dày đặc, dẫn đến thời gian giao hàng quá
            lâu (Quá {`${MAX_DELIVERY_DURATION} phút`}) vui lòng thử địa chỉ
            khác hoặc thử lại sau ít phút, xin cảm ơn!
          </Paragraph>
        ),
        title: 'Đã xảy ra lỗi',
        variant: 'error',
      },
    });
    return false;
  }
  return true;
};
