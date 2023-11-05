import type { ForgotPasswordDto } from 'backend/dtos/password/forgotPassword.dto';
import type { ResetPasswordDto } from 'backend/dtos/password/resetPassword.dto';
import type { VerifyCustomerEmailDto } from 'backend/dtos/verifyCustomerEmail.dto';
import type { JSSuccess } from 'backend/types/jsend';
import axiosInstance from 'constants/axiosFe.constant';
import {
  FORGOT_PASSWORD_API_ROUTE,
  RESEND_VERIFICATION_EMAIL_API_ROUTE,
  RESET_PASSWORD_API_ROUTE,
  VERIFY_EMAIL_API_ROUTE,
} from 'constants/routes.api.constant';
import type { FullyPopulatedAccountModel } from 'models/account.model';

const verifyEmail = async (
  dto: VerifyCustomerEmailDto,
): Promise<FullyPopulatedAccountModel> => {
  try {
    const response = await axiosInstance.post<
      JSSuccess<FullyPopulatedAccountModel>
    >(VERIFY_EMAIL_API_ROUTE, dto);

    return response.data.data;
  } catch (err: any) {
    return err.response.data;
  }
};

const forgotPassword = async (dto: ForgotPasswordDto): Promise<undefined> => {
  const response = await axiosInstance.post<JSSuccess<undefined>>(
    FORGOT_PASSWORD_API_ROUTE,
    dto,
  );
  return response.data.data;
};

const resetPassword = async (
  dto: ResetPasswordDto,
): Promise<FullyPopulatedAccountModel> => {
  const response = await axiosInstance.patch<
    JSSuccess<FullyPopulatedAccountModel>
  >(RESET_PASSWORD_API_ROUTE, dto);
  return response.data.data;
};

const resendVerificationEmail = async (email: string): Promise<undefined> => {
  const response = await axiosInstance.post<JSSuccess<undefined>>(
    RESEND_VERIFICATION_EMAIL_API_ROUTE,
    { email },
  );
  return response.data.data;
};

const mailCaller = {
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendVerificationEmail,
};
export default mailCaller;
