import type { ChangePasswordDto } from 'backend/dtos/password/changePassword.dto';
import type { UpdateProfileDto } from 'backend/dtos/profile/profile.dto';
import type { DashboardInfo } from 'backend/services/customer/helper';
import type { JSSuccess } from 'backend/types/jsend';
import axiosInstance from 'constants/axiosFe.constant';
import { PROFILE_API_ROUTE } from 'constants/routes.api.constant';
import type { FullyPopulatedAccountModel } from 'models/account.model';

// Assume it's a success response, because if it's not, it will get to the onError anyway
const getAccount = async (): Promise<DashboardInfo> => {
  const response =
    await axiosInstance.get<JSSuccess<DashboardInfo>>(PROFILE_API_ROUTE);
  return response.data.data;
};

const updateAccount = async (
  dto: UpdateProfileDto,
): Promise<FullyPopulatedAccountModel> => {
  const response = await axiosInstance.put<
    JSSuccess<FullyPopulatedAccountModel>
  >(PROFILE_API_ROUTE, dto);
  return response.data.data;
};

const changePassword = async (
  dto: ChangePasswordDto,
): Promise<FullyPopulatedAccountModel> => {
  const response = await axiosInstance.patch<
    JSSuccess<FullyPopulatedAccountModel>
  >(PROFILE_API_ROUTE, dto);
  return response.data.data;
};

const profileCaller = {
  getAccount,
  updateAccount,
  changePassword,
};

export default profileCaller;
