import type { IAccount } from 'api/models/Account.model/types';
import type {
  JSendFailResponse,
  JSendSuccessResponse,
} from 'api/types/response.type';
import axiosInstance from 'utils/axiosInstance';
import { SignUpRequestBody } from '../../../pages/api/signup';

export const signUp = async (
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
const apiCaller = {
  signUp,
};

export default apiCaller;
