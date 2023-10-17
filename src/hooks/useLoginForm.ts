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
  const [incorrect, setIncorrect] = useState(false);
  const [verified, setVerified] = useState(true);

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
          setVerified(false);
          setIncorrect(false);
        }
        if (notFound) {
          setIncorrect(true);
          setVerified(true);
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
    incorrect,
    verified,
  };
};
