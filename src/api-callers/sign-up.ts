import type { SignUpDto } from 'backend/dtos/signUp.dto';
import type { AccountWithPopulatedSide } from 'backend/types/auth';
import type { JSSuccess } from 'backend/types/jsend';
import axiosInstance from 'constants/axiosFe.constant';
import { SIGN_UP_API_ROUTE } from 'constants/routes.api.constant';

const signUp = async (
  dto: SignUpDto,
): Promise<AccountWithPopulatedSide<'customer'>> => {
  const response = await axiosInstance.post<
    JSSuccess<AccountWithPopulatedSide<'customer'>>
  >(SIGN_UP_API_ROUTE, dto);
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  return response.data.data;
};

const signUpCaller = {
  signUp,
};

export default signUpCaller;
