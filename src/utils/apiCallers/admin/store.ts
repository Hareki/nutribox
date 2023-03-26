import type { IStore } from 'api/models/Store.model/types';
import axiosInstance from 'utils/axiosInstance';

const getStoreInfo = async (id: string): Promise<IStore> => {
  const response = await axiosInstance.get(`/admin/store`, {
    params: {
      id,
    },
  });
  return response.data.data;
};

const apiCaller = {
  getStoreInfo,
};

export default apiCaller;
