import {
  getHours,
  getMinutes,
  getSeconds,
  isAfter,
  isBefore,
  isEqual,
} from 'date-fns';

import { DayOfWeek } from 'backend/enums/entities.enum';

type DateLike = Date | string | number;

const getDateObject = (date: DateLike) =>
  date instanceof Date ? date : new Date(date);

export const isDateTimeBeforeOrEqual = (date1: DateLike, date2: DateLike) => {
  const dateObject1 = getDateObject(date1);
  const dateObject2 = getDateObject(date2);
  return (
    isBefore(dateObject1, dateObject2) || isEqual(dateObject1, dateObject2)
  );
};

export const isTimeBeforeOrEqual = (date1: DateLike, date2: DateLike) => {
  const dateObject1 = getDateObject(date1);
  const dateObject2 = getDateObject(date2);

  const hours1 = getHours(dateObject1);
  const minutes1 = getMinutes(dateObject1);
  const seconds1 = getSeconds(dateObject1);

  const hours2 = getHours(dateObject2);
  const minutes2 = getMinutes(dateObject2);
  const seconds2 = getSeconds(dateObject2);

  if (hours1 < hours2) return true;
  if (hours1 > hours2) return false;

  if (minutes1 < minutes2) return true;
  if (minutes1 > minutes2) return false;

  if (seconds1 <= seconds2) return true;

  return false;
};

export const isDateTimeAfter = (date1: DateLike, date2: DateLike): boolean => {
  const dateObject1 = getDateObject(date1);
  const dateObject2 = getDateObject(date2);
  return isAfter(dateObject1, dateObject2);
};

export const isTimeAfter = (date1: DateLike, date2: DateLike): boolean => {
  const dateObject1 = getDateObject(date1);
  const dateObject2 = getDateObject(date2);

  const hours1 = getHours(dateObject1);
  const minutes1 = getMinutes(dateObject1);
  const seconds1 = getSeconds(dateObject1);

  const hours2 = getHours(dateObject2);
  const minutes2 = getMinutes(dateObject2);
  const seconds2 = getSeconds(dateObject2);

  if (hours1 > hours2) return true;
  if (hours1 < hours2) return false;

  if (minutes1 > minutes2) return true;
  if (minutes1 < minutes2) return false;

  if (seconds1 > seconds2) return true;

  return false;
};

export const isTimeAfterOrEqual = (
  date1: DateLike,
  date2: DateLike,
): boolean => {
  return (
    isTimeAfter(date1, date2) ||
    isEqual(getDateObject(date1), getDateObject(date2))
  );
};

export const isTimeWithinRange = (
  date: DateLike,
  startDate: DateLike,
  endDate: DateLike,
): boolean => {
  return (
    isTimeAfterOrEqual(date, startDate) && isTimeBeforeOrEqual(date, endDate)
  );
};

export const getDayOfWeek = (day: number): DayOfWeek => {
  const weekday = [
    DayOfWeek.SUNDAY,
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
  ];
  return weekday[day];
};
