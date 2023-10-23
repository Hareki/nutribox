import type { UpdateStoreInfoDto } from 'backend/dtos/store/updateStoreInfo.dto';
import { UpdateStoreInfoDtoSchema } from 'backend/dtos/store/updateStoreInfo.dto';
import type { UpdateStoreWorkTimesDto } from 'backend/dtos/store/updateStoreWorkTimes.dto';
import type { JSSuccess } from 'backend/types/jsend';
import axiosInstance from 'constants/axiosFe.constant';
import { STORE_DETAIL_API_STAFF_ROUTE } from 'constants/routes.api.constant';
import { STORE_ID } from 'constants/temp.constant';
import type { PopulateStoreFields, StoreModel } from 'models/store.model';
import { insertId } from 'utils/middleware.helper';

const getStoreInfoAndWorkTimes = async (
  id = STORE_ID,
): Promise<PopulateStoreFields<'storeWorkTimes'>> => {
  const response = await axiosInstance.get<
    JSSuccess<PopulateStoreFields<'storeWorkTimes'>>
  >(insertId(STORE_DETAIL_API_STAFF_ROUTE, id));

  return response.data.data;
};

const updateStoreInfo = async (
  id = STORE_ID,
  dto: UpdateStoreInfoDto,
): Promise<StoreModel> => {
  const response = await axiosInstance.patch<JSSuccess<StoreModel>>(
    insertId(STORE_DETAIL_API_STAFF_ROUTE, id),
    dto,
  );

  return response.data.data;
};

const updateStoreWorkTimes = async (
  id = STORE_ID,
  dto: UpdateStoreWorkTimesDto,
): Promise<PopulateStoreFields<'storeWorkTimes'>> => {
  const response = await axiosInstance.put<
    JSSuccess<PopulateStoreFields<'storeWorkTimes'>>
  >(insertId(STORE_DETAIL_API_STAFF_ROUTE, id), dto);

  return response.data.data;
};

const staffStoreCaller = {
  getStoreInfoAndWorkTimes,
  updateStoreInfo,
  updateStoreWorkTimes,
};

export default staffStoreCaller;
