import type { UpdateSupplierInfoRb } from '../../../../pages/api/admin/supplier/[id]';
import type { CreateSupplierRb } from '../../../../pages/api/admin/supplier/create';

import type { ISupplier } from 'api/models/Supplier.model/types';
import type { GetAllPaginationResult } from 'api/types/pagination.type';
import axiosInstance from 'constants/axiosFe.constant';
import { AdminMainTablePaginationConstant } from 'utils/constants';

const getSuppliers = async (
  page: number,
): Promise<GetAllPaginationResult<ISupplier>> => {
  const response = await axiosInstance.get(`admin/supplier/all`, {
    params: {
      docsPerPage: AdminMainTablePaginationConstant.docsPerPage,
      page,
    },
  });
  return response.data.data;
};

const getSupplier = async (supplierId: string): Promise<ISupplier> => {
  const response = await axiosInstance.get(`admin/supplier/${supplierId}`);
  return response.data.data;
};

const createSupplier = async (
  requestBody: CreateSupplierRb,
): Promise<ISupplier> => {
  const response = await axiosInstance.post(
    `admin/supplier/create`,
    requestBody,
  );
  return response.data.data;
};

const updateSupplier = async (
  supplierId: string,
  requestBody: UpdateSupplierInfoRb,
): Promise<ISupplier> => {
  const response = await axiosInstance.put(
    `admin/supplier/${supplierId}`,
    requestBody,
  );
  return response.data.data;
};

const searchSuppliersByName = async (
  searchQuery: string,
): Promise<ISupplier[]> => {
  if (!searchQuery) return [];
  const response = await axiosInstance.get('admin/supplier/search', {
    params: {
      name: searchQuery,
    },
  });

  const result = response.data.data;
  if (!result) return [];
  return result;
};

const apiCaller = {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  searchSuppliersByName,
};

export default apiCaller;
