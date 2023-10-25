import type { NewSupplierDto } from 'backend/dtos/suppliers/newSupplier.dto';
import type { UpdateSupplierDto } from 'backend/dtos/suppliers/updateSupplier.dto';
import type { JSSuccess } from 'backend/types/jsend';
import axiosInstance from 'constants/axiosFe.constant';
import {
  SUPPLIERS_API_STAFF_ROUTE,
  SUPPLIER_DETAIL_API_STAFF_ROUTE,
} from 'constants/routes.api.constant';
import { convertToPaginationResult } from 'helpers/pagination.help';
import type { SupplierModel } from 'models/supplier.model';
import type { GetAllPaginationResult } from 'types/pagination';
import { insertId } from 'utils/middleware.helper';

const getSuppliers = async (
  page: number,
): Promise<GetAllPaginationResult<SupplierModel>> => {
  const response = await axiosInstance.get<JSSuccess<SupplierModel[]>>(
    SUPPLIERS_API_STAFF_ROUTE,
    {
      params: {
        page,
      },
    },
  );

  return convertToPaginationResult(response);
};

const getSupplier = async (supplierId: string): Promise<SupplierModel> => {
  const response = await axiosInstance.get(
    insertId(SUPPLIER_DETAIL_API_STAFF_ROUTE, supplierId),
  );
  return response.data.data;
};

const createSupplier = async (
  requestBody: NewSupplierDto,
): Promise<SupplierModel> => {
  const response = await axiosInstance.post(
    SUPPLIERS_API_STAFF_ROUTE,
    requestBody,
  );
  return response.data.data;
};

const updateSupplier = async (
  supplierId: string,
  requestBody: UpdateSupplierDto,
): Promise<SupplierModel> => {
  const response = await axiosInstance.put(
    insertId(SUPPLIER_DETAIL_API_STAFF_ROUTE, supplierId),
    requestBody,
  );
  return response.data.data;
};

const searchSuppliersByName = async (
  searchQuery: string,
): Promise<SupplierModel[]> => {
  if (!searchQuery) return [];
  const response = await axiosInstance.get(SUPPLIERS_API_STAFF_ROUTE, {
    params: {
      name: searchQuery,
    },
  });

  const result = response.data.data;
  if (!result) return [];
  return result;
};

const staffSupplierCaller = {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  searchSuppliersByName,
};

export default staffSupplierCaller;
