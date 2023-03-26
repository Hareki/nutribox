import { getUtcDate } from 'lib';

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
  const fromTimeUtc = getUtcDate(fromTime);
  const toTimeUtc = getUtcDate(toTime);

  const fromTimeLabel = `${fromTimeUtc.getHours()}:${fromTimeUtc
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
  const toTimeLabel = `${toTimeUtc.getHours()}:${toTimeUtc
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
  return `${fromTimeLabel} - ${toTimeLabel}`;
};
