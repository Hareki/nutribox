import CustomerOrderModel from 'api/models/CustomerOrder.model';
import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';

const getOrdersBetweenDates = async (startDate: Date, endDate: Date) => {
  return await CustomerOrderModel().find({
    createdAt: {
      $gte: startDate,
      $lt: endDate,
    },
  });
};

const getTodayRange = () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );
  return { startOfDay, startOfTomorrow };
};

const getPreviousMonthRange = () => {
  const now = new Date();
  const firstDayOfPrevMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1,
  );
  const currentDayOfPrevMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate(),
  );
  return { firstDayOfPrevMonth, currentDayOfPrevMonth };
};

const getThisMonthRange = () => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfNextMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1,
  );
  return { firstDayOfMonth, firstDayOfNextMonth };
};

const getOrderCountAndProfit = (orders: ICustomerOrder[]) => {
  const totalProfit = orders.reduce(
    (accumulator, order) => accumulator + order.profit,
    0,
  );
  const orderCount = orders.length;
  return { totalProfit, orderCount };
};

export {
  getOrdersBetweenDates,
  getTodayRange,
  getPreviousMonthRange,
  getThisMonthRange,
  getOrderCountAndProfit,
};
