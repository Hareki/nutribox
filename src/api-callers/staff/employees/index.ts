import type { NewEmployeeDto } from 'backend/dtos/employees/NewEmployee.dto';
import type { UpdateEmployeeDto } from 'backend/dtos/employees/UpdateEmployee.dto';
import type { CommonEmployeeModel } from 'backend/services/employee/helper';
import type { JSSuccess } from 'backend/types/jsend';
import axiosInstance from 'constants/axiosFe.constant';
import {
  EMPLOYEES_API_STAFF_ROUTE,
  EMPLOYEE_DETAIL_API_STAFF_ROUTE,
} from 'constants/routes.api.constant';
import { convertToPaginationResult } from 'helpers/pagination.help';
import type { GetAllPaginationResult } from 'types/pagination';
import { insertId } from 'utils/middleware.helper';

const getEmployees = async (
  page: number,
): Promise<GetAllPaginationResult<CommonEmployeeModel>> => {
  const response = await axiosInstance.get<JSSuccess<CommonEmployeeModel[]>>(
    EMPLOYEES_API_STAFF_ROUTE,
    {
      params: {
        page,
      },
    },
  );

  return convertToPaginationResult(response);
};

const getEmployee = async (
  employeeId: string,
): Promise<CommonEmployeeModel> => {
  const response = await axiosInstance.get(
    insertId(EMPLOYEE_DETAIL_API_STAFF_ROUTE, employeeId),
  );
  return response.data.data;
};

const createEmployee = async (
  requestBody: NewEmployeeDto,
): Promise<CommonEmployeeModel> => {
  const response = await axiosInstance.post(
    EMPLOYEES_API_STAFF_ROUTE,
    requestBody,
  );
  return response.data.data;
};

const updateEmployee = async (
  employeeId: string,
  requestBody: UpdateEmployeeDto,
): Promise<CommonEmployeeModel> => {
  const response = await axiosInstance.put(
    insertId(EMPLOYEE_DETAIL_API_STAFF_ROUTE, employeeId),
    requestBody,
  );
  return response.data.data;
};

const searchEmployeesByName = async (
  searchQuery: string,
): Promise<CommonEmployeeModel[]> => {
  if (!searchQuery) return [];
  const response = await axiosInstance.get(EMPLOYEES_API_STAFF_ROUTE, {
    params: {
      keyword: searchQuery,
    },
  });

  const result = response.data.data;
  if (!result) return [];
  return result;
};

const staffEmployeeCaller = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  searchEmployeesByName,
};

export default staffEmployeeCaller;
