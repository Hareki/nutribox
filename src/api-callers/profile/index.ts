import type { ChangePasswordDto } from 'backend/dtos/password/changePassword.dto';
import type {
  UpdateProfileAvatarDto,
  UpdateProfileDto,
} from 'backend/dtos/profile/profile.dto';
import type { CustomerDashboardData } from 'backend/services/customer/helper';
import type { JSSuccess } from 'backend/types/jsend';
import axiosInstance from 'constants/axiosFe.constant';
import {
  PROFILE_API_ROUTE,
  PROFILE_AVATAR_API_ROUTE,
} from 'constants/routes.api.constant';
import type { FullyPopulatedAccountModel } from 'models/account.model';
import type { CustomerModel } from 'models/customer.model';

// Assume it's a success response, because if it's not, it will get to the onError anyway
const getDashboardInfo = async (): Promise<CustomerDashboardData> => {
  const response =
    await axiosInstance.get<JSSuccess<CustomerDashboardData>>(
      PROFILE_API_ROUTE,
    );
  return response.data.data;
};

const updateAccount = async (dto: UpdateProfileDto): Promise<CustomerModel> => {
  const response = await axiosInstance.put<JSSuccess<CustomerModel>>(
    PROFILE_API_ROUTE,
    dto,
  );
  return response.data.data;
};

const updateAvatar = async (
  dto: UpdateProfileAvatarDto,
): Promise<CustomerModel> => {
  const response = await axiosInstance.put<JSSuccess<CustomerModel>>(
    PROFILE_AVATAR_API_ROUTE,
    dto,
  );
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
  getDashboardInfo,
  updateAccount,
  changePassword,
  updateAvatar,
};

export default profileCaller;
