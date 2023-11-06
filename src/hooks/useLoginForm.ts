import { useMutation } from '@tanstack/react-query';
import type { SignInResponse } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

import type { SignInDto } from 'backend/dtos/signIn.dto';
import type { UserType } from 'backend/types/auth';

export interface LoginRequestBody {
  email: string;
  password: string;
}

export const useLoginForm = (userType: UserType) => {
  const [signInResponse, setSignInResponse] = useState<SignInResponse>();

  const [errorMessage, setErrorMessage] = useState<string>('');
  const { mutate: invokeSignIn, isLoading } = useMutation<
    SignInResponse | undefined,
    any,
    SignInDto
  >({
    mutationFn: (values) =>
      signIn('credentials', {
        redirect: false,
        ...values,
        userType,
      }),
    onSuccess: (result) => {
      if (!result?.ok) {
        const notVerified = result?.error?.includes('Account.Verified.False');
        const notFound = result?.error?.includes('CredentialsSignin');
        const notActive = result?.error?.includes('Account.Disabled.True');

        if (notVerified) {
          setErrorMessage('Account.Verified.False');
        }
        if (notFound) {
          setErrorMessage('Account.Credentials.Invalid');
        }
        if (notActive) {
          setErrorMessage('Account.Disabled.True');
        }

        return;
      }

      setSignInResponse(result);
    },
  });

  const handleFormSubmit = async (values: SignInDto) => {
    invokeSignIn(values);
  };

  return {
    checkingCredentials: isLoading,
    handleFormSubmit,
    signInResponse,
    errorMessage,
  };
};
