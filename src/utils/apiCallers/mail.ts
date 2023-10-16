import type {
  JSendFailResponse,
  JSendSuccessResponse,
} from 'api/types/response.type';
import axiosInstance from 'constants/axiosFe.constant';

const sendVerificationEmail = async (
  email: string,
): Promise<
  JSendSuccessResponse<string> | JSendFailResponse<Record<string, string>>
> => {
  try {
    const response = await axiosInstance.post('/mail/send-verification-email', {
      email,
    });

    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

const checkVerification = async (
  email: string,
): Promise<
  JSendSuccessResponse<boolean> | JSendFailResponse<Record<string, string>>
> => {
  try {
    const response = await axiosInstance.post('/mail/check-verification', {
      email,
    });

    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

const requestResetPassword = async (email: string): Promise<string> => {
  const response = await axiosInstance.post('/mail/request-reset-password', {
    email,
  });

  return response.data;
};

type ResetPassword = {
  newPassword: string;
  token: string;
};

const resetPassword = async ({
  newPassword,
  token,
}: ResetPassword): Promise<string> => {
  const response = await axiosInstance.post('/mail/reset-password', {
    newPassword,
    token,
  });

  return response.data;
};

const apiCaller = {
  sendVerificationEmail,
  checkVerification,
  requestResetPassword,
  resetPassword,
};
export default apiCaller;
