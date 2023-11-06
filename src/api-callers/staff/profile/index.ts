import type { ChangePasswordDto } from 'backend/dtos/password/changePassword.dto';
import type {
  UpdateProfileAvatarDto,
  UpdateProfileDto,
} from 'backend/dtos/profile/profile.dto';
import type { CommonEmployeeModel } from 'backend/services/employee/helper';
import type { JSSuccess } from 'backend/types/jsend';
import axiosInstance from 'constants/axiosFe.constant';
import {
  PROFILE_API_STAFF_ROUTE,
  PROFILE_AVATAR_API_STAFF_ROUTE,
} from 'constants/routes.api.constant';
import type { FullyPopulatedAccountModel } from 'models/account.model';

const updateAccount = async (
  dto: UpdateProfileDto,
): Promise<CommonEmployeeModel> => {
  const response = await axiosInstance.put<JSSuccess<CommonEmployeeModel>>(
    PROFILE_API_STAFF_ROUTE,
    dto,
  );
  return response.data.data;
};

const updateAvatar = async (
  dto: UpdateProfileAvatarDto,
): Promise<CommonEmployeeModel> => {
  const response = await axiosInstance.put<JSSuccess<CommonEmployeeModel>>(
    PROFILE_AVATAR_API_STAFF_ROUTE,
    dto,
  );
  return response.data.data;
};

const changePassword = async (
  dto: ChangePasswordDto,
): Promise<FullyPopulatedAccountModel> => {
  const response = await axiosInstance.patch<
    JSSuccess<FullyPopulatedAccountModel>
  >(PROFILE_API_STAFF_ROUTE, dto);
  return response.data.data;
};

const staffProfileCaller = {
  updateAccount,
  changePassword,
  updateAvatar,
};

export default staffProfileCaller;
