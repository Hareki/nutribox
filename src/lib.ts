import { differenceInMinutes } from 'date-fns';
import ceil from 'lodash/ceil';
import getConfig from 'next/config';

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

function formatDate(date: string) {
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

function formatDateTime(date: Date): string {
  const formatter = new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour12: false,
  });
  const formattedDateTime = formatter.format(date);
  const formattedTime = formattedDateTime.slice(0, 5);
  const formattedDate = formattedDateTime.slice(6);
  return `${formattedTime} - ${formattedDate}`;
}

export {
  renderProductCount,
  calculateDiscount,
  formatCurrency,
  getDateDifference,
  formatDate,
  calculateEndTime,
  formatDateTime,
};
