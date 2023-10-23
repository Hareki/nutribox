import type { UpdateStoreWorkTimesDto } from 'backend/dtos/store/updateStoreWorkTimes.dto';
import { DayOfWeek } from 'backend/enums/entities.enum';

export const getDayOfWeekLabel = (dayOfWeek: string) => {
  const value = dayOfWeek.toLowerCase();
  switch (value) {
    case 'monday':
      return 'Thứ hai';
    case 'tuesday':
      return 'Thứ ba';
    case 'wednesday':
      return 'Thứ tư';
    case 'thursday':
      return 'Thứ năm';
    case 'friday':
      return 'Thứ sáu';
    case 'saturday':
      return 'Thứ bảy';
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

export const transformStoreHoursToFormikValue = (
  storeWorkTimes: UpdateStoreWorkTimesDto,
): Record<DayOfWeek, { from: Date; to: Date }> => {
  const initialValues: Record<DayOfWeek, { from: Date; to: Date }> = {
    MONDAY: { from: new Date(), to: new Date() },
    TUESDAY: { from: new Date(), to: new Date() },
    WEDNESDAY: { from: new Date(), to: new Date() },
    THURSDAY: { from: new Date(), to: new Date() },
    FRIDAY: { from: new Date(), to: new Date() },
    SATURDAY: { from: new Date(), to: new Date() },
    SUNDAY: { from: new Date(), to: new Date() },
  };

  const dayMapping: Record<string, DayOfWeek> = {
    MONDAY: DayOfWeek.MONDAY,
    TUESDAY: DayOfWeek.TUESDAY,
    WEDNESDAY: DayOfWeek.WEDNESDAY,
    THURSDAY: DayOfWeek.THURSDAY,
    FRIDAY: DayOfWeek.FRIDAY,
    SATURDAY: DayOfWeek.SATURDAY,
    SUNDAY: DayOfWeek.SUNDAY,
  };

  storeWorkTimes.forEach((storeHour) => {
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

export const transformFormikValuesToStoreWorkTimes = (
  values: Record<DayOfWeek, { from: Date; to: Date }>,
): UpdateStoreWorkTimesDto => {
  return Object.entries(values).map(([day, times]) => ({
    dayOfWeek: day as DayOfWeek,
    openTime: times.from,
    closeTime: times.to,
  }));
};
