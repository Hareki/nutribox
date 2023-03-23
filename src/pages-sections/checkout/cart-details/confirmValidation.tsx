import { Paragraph, Span } from 'components/abstract/Typography';
import type { InfoDialogAction } from 'components/dialog/info-dialog/reducer';
import { getLocalTimeInVietnam } from 'lib';
import { MAX_DELIVERY_RANGE } from 'utils/constants';

export const checkTime = (
  dispatchInfo: (value: InfoDialogAction) => void,
): boolean => {
  return true;
  const now = getLocalTimeInVietnam();
  if (now.getHours() >= 18) {
    dispatchInfo({
      type: 'open_dialog',
      payload: {
        content: (
          <Paragraph>
            Chúng tôi chỉ giao hàng từ <Span fontWeight={600}>8h đến 18h</Span>{' '}
            hàng ngày, vui lòng quay lại vào ngày mai.
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
