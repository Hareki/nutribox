import { useMutation } from '@tanstack/react-query';
import type { SignInResponse } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

import type { SignInDto } from 'backend/dtos/signIn.dto';

export interface LoginRequestBody {
  email: string;
  password: string;
}

export const useLoginForm = () => {
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
        userType: 'customer',
      }),
    onSuccess: (result) => {
      if (!result?.ok) {
        const notVerified = result?.error?.includes('Account.Verified.Invalid');
        const notFound = result?.error?.includes('CredentialsSignin');
        if (notVerified) {
          setErrorMessage('Account.Verified.Invalid');
        }
        if (notFound) {
          setErrorMessage('Account.Credentials.Invalid');
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
