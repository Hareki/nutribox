import { differenceInMinutes } from 'date-fns';
import ceil from 'lodash/ceil';
import getConfig from 'next/config';

import type { DateLike } from 'utils/date.helper';
import { getDateObject } from 'utils/date.helper';

/**
 * GET THE DIFFERENCE DATE FORMAT
 * @param  date - which is created comment data
 * @returns string - formatted from now
 */

function getDateDifference(date: string | number | Date) {
  let diff = differenceInMinutes(new Date(), new Date(date));
  if (diff < 60) return diff + ' minutes ago';

  diff = ceil(diff / 60);
  if (diff < 24) return `${diff} hour${diff === 0 ? '' : 's'} ago`;

  diff = ceil(diff / 24);
  if (diff < 30) return `${diff} day${diff === 0 ? '' : 's'} ago`;

  diff = ceil(diff / 30);
  if (diff < 12) return `${diff} month${diff === 0 ? '' : 's'} ago`;

  diff = diff / 12;
  return `${diff.toFixed(1)} year${ceil(diff) === 0 ? '' : 's'} ago`;
}

/**
 * RENDER THE PRODUCT PAGINATION INFO
 * @param page - CURRENT PAGE NUMBER
 * @param perPageProduct - PER PAGE PRODUCT LIST
 * @param totalProduct - TOTAL PRODUCT NUMBER
 * @returns
 */

function renderProductCount(
  page: number,
  perPageProduct: number,
  totalProduct: number,
) {
  const startNumber = (page - 1) * perPageProduct;
  let endNumber = page * perPageProduct;

  if (endNumber > totalProduct) {
    endNumber = totalProduct;
  }
  return `Showing ${startNumber - 1}-${endNumber} of ${totalProduct} products`;
}

/**
 * CALCULATE PRICE WITH PRODUCT DISCOUNT THEN RETURN NEW PRODUCT PRICES
 * @param  price - PRODUCT PRICE
 * @param  discount - DISCOUNT PERCENT
 * @returns - RETURN NEW PRICE
 */

function calculateDiscount(price: number, discount: number) {
  const afterDiscount = Number((price - price * (discount / 100)).toFixed(2));
  return formatCurrency(afterDiscount);
}

/**
 * CHANGE THE CURRENCY FORMAT
 * @param  price - PRODUCT PRICE
 * @param  fraction - HOW MANY FRACTION WANT TO SHOW
 * @returns - RETURN PRICE WITH CURRENCY
 */

function formatCurrency(price: number, fraction = 0) {
  const { publicRuntimeConfig } = getConfig();

  const formatCurrency = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: publicRuntimeConfig.currency,
    maximumFractionDigits: fraction,
    minimumFractionDigits: fraction,
  });

  return formatCurrency.format(price);
}

function formatNumber(num: number) {
  const formatter = new Intl.NumberFormat('en-US');
  return formatter.format(num);
}

// FIXME inconsistent input type, should be date object
function formatDate(date: DateLike) {
  const realDate = new Date(date);
  const formatter = new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const formattedDate = formatter.format(realDate);
  return formattedDate;
}

function calculateEndTime(duration: number): Date {
  const currentTime = new Date();
  const endTime = new Date(currentTime.getTime() + duration * 60000); // 60000 milliseconds in a minute
  return endTime;
}

function formatDateTime(date: DateLike): string {
  const dateObject = getDateObject(date);
  const formatter = new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour12: false,
  });
  const formattedDateTime = formatter.format(dateObject);
  const formattedTime = formattedDateTime.slice(0, 5);
  const formattedDate = formattedDateTime.slice(6);
  return `${formattedTime} - ${formattedDate}`;
}

function getUtcDate(date: DateLike) {
  const dateObject = getDateObject(date);
  const utcDate = new Date(
    dateObject.getUTCFullYear(),
    dateObject.getUTCMonth(),
    dateObject.getUTCDate(),
    dateObject.getUTCHours(),
    dateObject.getUTCMinutes(),
    dateObject.getUTCSeconds(),
  );
  return utcDate;
}

function getLocalTimeInVietnam() {
  const utcNow = getUtcDate(new Date());
  const vietnamTimeZoneOffset = 7 * 60 * 60 * 1000; // Vietnam Time Zone offset in milliseconds (UTC+7)

  const localTime = new Date(utcNow.getTime() + vietnamTimeZoneOffset);

  return localTime;
}

function getTodaysDayOfWeekAllCaps(): string {
  const today = getLocalTimeInVietnam();
  const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' });
  const dayOfWeek = formatter.format(today).toUpperCase();
  return dayOfWeek;
}

function compareTimes(date1: Date, date2: Date) {
  const hours1 = date1.getHours();
  const minutes1 = date1.getMinutes();
  const hours2 = date2.getHours();
  const minutes2 = date2.getMinutes();

  if (hours1 < hours2) {
    return -1;
  } else if (hours1 > hours2) {
    return 1;
  } else {
    if (minutes1 < minutes2) {
      return -1;
    } else if (minutes1 > minutes2) {
      return 1;
    } else {
      return 0;
    }
  }
}

// export function addDays(date: Date, days: number) {
//   const timestamp = date.getTime(); // Get the current timestamp in milliseconds
//   const daysInMilliseconds = days * 24 * 60 * 60 * 1000; // Convert days to milliseconds
//   const newTimestamp = timestamp + daysInMilliseconds; // Add the days in milliseconds to the current timestamp
//   return new Date(newTimestamp); // Create a new Date object with the updated timestamp
// }

export {
  renderProductCount,
  calculateDiscount,
  formatCurrency,
  formatNumber,
  getDateDifference,
  formatDate,
  calculateEndTime,
  formatDateTime,
  getLocalTimeInVietnam,
  getTodaysDayOfWeekAllCaps,
  compareTimes,
};
