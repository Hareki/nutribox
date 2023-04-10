import type { SignUpRequestBody } from './../../../pages/api/signup';

import type { IAccount } from 'api/models/Account.model/types';
import type {
  JSendFailResponse,
  JSendSuccessResponse,
} from 'api/types/response.type';
import axiosInstance from 'utils/axiosInstance';

const signUp = async (
  requestBody: SignUpRequestBody,
): Promise<
  JSendSuccessResponse<IAccount> | JSendFailResponse<Record<string, string>>
> => {
  try {
    const response = await axiosInstance.post('/signup', {
      ...requestBody,
    });

    // await new Promise((resolve) => setTimeout(resolve, 3000));

    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

const sendVerificationEmail = async (
  email: string,
): Promise<
  JSendSuccessResponse<string> | JSendFailResponse<Record<string, string>>
> => {
  try {
    const response = await axiosInstance.get('/mail/send-verification-email', {
      params: {
        email,
      },
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

const apiCaller = {
  signUp,
  sendVerificationEmail,
  checkVerification,
};

export default apiCaller;
