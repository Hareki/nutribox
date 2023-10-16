import type { DashboardData } from '../../../../pages/api/admin/dashboard';

import axiosInstance from 'constants/axiosFe.constant';

const getStatisticData = async (): Promise<DashboardData> => {
  const response = await axiosInstance.get(`/admin/dashboard`);
  return response.data.data;
};

const apiCaller = {
  getStatisticData,
};

export default apiCaller;
