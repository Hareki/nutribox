import type { SignInResponse } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

import apiCaller from 'utils/apiCallers/signup';

export interface LoginRequestBody {
  email: string;
  password: string;
}

export const useLoginForm = () => {
  const [checkingCredentials, setCheckingCredentials] = useState(false);
  const [signInResponse, setSignInResponse] = useState<SignInResponse>();
  const [incorrect, setIncorrect] = useState(false);
  const [verified, setVerified] = useState(true);

  const handleFormSubmit = async (values: LoginRequestBody) => {
    setCheckingCredentials(true);
    const { data: verified } = await apiCaller.checkVerification(values.email);
    console.log(
      'file: useLoginForm.ts:21 - handleFormSubmit - verified:',
      verified,
    );
    console.log(
      'file: useLoginForm.ts:21 - handleFormSubmit - values.email:',
      values.email,
    );
    if (!verified) {
      setCheckingCredentials(false);
      setVerified(false);
      return;
    }

    const result = await signIn('credentials', { redirect: false, ...values });
    setSignInResponse(result);
    setCheckingCredentials(false);
    if (result && !result.ok) {
      setIncorrect(true);
      // setLoading(false);
    }
  };
  // Can't merge signInResponse and incorrect into one state, because initially incorrect is false, and signInResponse is undefined.
  // If we omit the signInResponse state and use the incorrect alone, that means it will automatically sign in the user.
  return {
    checkingCredentials,
    handleFormSubmit,
    signInResponse,
    incorrect,
    verified,
  };
};
