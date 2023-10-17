import axiosInstance from 'constants/axiosFe.constant';
import { STORE_DETAIL_API_ROUTE } from 'constants/routes.api.constant';
import type { PopulateStoreFields } from 'models/store.model';
import { insertId } from 'utils/middleware.helper';

const getStoreInfo = async (
  id: string,
): Promise<PopulateStoreFields<'storeWorkTimes'>> => {
  const response = await axiosInstance.get(
    insertId(STORE_DETAIL_API_ROUTE, id),
  );
  return response.data.data;
};

const apiCaller = {
  getStoreInfo,
};

export default apiCaller;
