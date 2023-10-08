import { isBefore, isEqual } from 'date-fns';

type DateLike = Date | string | number;

const getDateObject = (date: DateLike) =>
  date instanceof Date ? date : new Date(date);

export const isBeforeOrEqual = (date1: DateLike, date2: DateLike) => {
  const dateObject1 = getDateObject(date1);
  const dateObject2 = getDateObject(date2);
  return (
    isBefore(dateObject1, dateObject2) || isEqual(dateObject1, dateObject2)
  );
};
