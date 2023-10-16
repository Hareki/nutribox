import type { IStore } from 'api/models/Store.model/types';

import type { UpdateStoreInfoRb } from '../../../../pages/api/admin/store';

import axiosInstance from 'constants/axiosFe.constant';

const getStoreInfo = async (id: string): Promise<IStore> => {
  const response = await axiosInstance.get('/store', {
    params: {
      id,
    },
  });
  return response.data.data;
};

const updateStoreInfo = async (body: UpdateStoreInfoRb): Promise<IStore> => {
  const response = await axiosInstance.put('/admin/store', body);
  return response.data.data;
};

const apiCaller = {
  getStoreInfo,
  updateStoreInfo,
};

export default apiCaller;
