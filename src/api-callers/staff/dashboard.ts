import type { ManagerDashboardData } from 'backend/services/dashboard/helper';
import axiosInstance from 'constants/axiosFe.constant';
import { DASHBOARD_API_STAFF_ROUTE } from 'constants/routes.api.constant';

const getDashboardData = async (): Promise<ManagerDashboardData> => {
  const response = await axiosInstance.get(DASHBOARD_API_STAFF_ROUTE);
  return response.data.data;
};

const dashboardCaller = {
  getDashboardData,
};

export default dashboardCaller;
