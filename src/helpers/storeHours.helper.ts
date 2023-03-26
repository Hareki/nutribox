import type { IStoreHour } from 'api/models/Store.model/StoreHour.schema/types';
import type { WeekDays } from 'pages-sections/admin/store-setting/StoreHoursForm';

export const getDayOfWeekLabel = (dayOfWeek: string) => {
  const value = dayOfWeek.toLowerCase();
  switch (value) {
    case 'monday':
      return 'Thứ 2';
    case 'tuesday':
      return 'Thứ 3';
    case 'wednesday':
      return 'Thứ 4';
    case 'thursday':
      return 'Thứ 5';
    case 'friday':
      return 'Thứ 6';
    case 'saturday':
      return 'Thứ 7';
    case 'sunday':
      return 'Chủ nhật';
    default:
      return 'Thứ 2';
  }
};

export const getStoreHoursLabel = (fromTime: Date, toTime: Date) => {
  const fromTimeLabel = `${fromTime.getHours()}:${fromTime
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
  const toTimeLabel = `${toTime.getHours()}:${toTime
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
  return `${fromTimeLabel} - ${toTimeLabel}`;
};

export const transformStoreHoursToFormikValue = (storeHours: IStoreHour[]) => {
  const initialValues: Record<WeekDays, { from: Date; to: Date }> = {
    monday: { from: new Date(), to: new Date() },
    tuesday: { from: new Date(), to: new Date() },
    wednesday: { from: new Date(), to: new Date() },
    thursday: { from: new Date(), to: new Date() },
    friday: { from: new Date(), to: new Date() },
    saturday: { from: new Date(), to: new Date() },
    sunday: { from: new Date(), to: new Date() },
  };

  const dayMapping: Record<string, WeekDays> = {
    MONDAY: 'monday',
    TUESDAY: 'tuesday',
    WEDNESDAY: 'wednesday',
    THURSDAY: 'thursday',
    FRIDAY: 'friday',
    SATURDAY: 'saturday',
    SUNDAY: 'sunday',
  };

  storeHours.forEach((storeHour) => {
    const dayOfWeek = dayMapping[storeHour.dayOfWeek];
    const openTime = new Date(storeHour.openTime);
    const closeTime = new Date(storeHour.closeTime);

    initialValues[dayOfWeek] = {
      from: openTime,
      to: closeTime,
    };
  });

  return initialValues;
};
