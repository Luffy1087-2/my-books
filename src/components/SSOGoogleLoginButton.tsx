import { useState } from 'react';
import { useGoogleLogin } from "@react-oauth/google";
import { UserEntityModel } from '@my-books/core';
import useCreateUserIfNotExists from '../hook/useCreateUserIfNotExists.hook';

export function SSOGoogleLoginButton({ setUserState }: {
  setUserState: (sessionData: UserEntityModel | null) => void
}) {
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  useCreateUserIfNotExists(googleAccessToken, setUserState);

  const loginHandler = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      if (!tokenResponse) throw new TypeError('login failed');
      setGoogleAccessToken(tokenResponse.access_token);
    },
    onError: (error) => {
      console.log('sso google error', error);
      sessionStorage.removeItem('userToken');
      setUserState(null);
    },
    flow: 'implicit',
    scope: 'openid profile email'
  })

  return (
    <button onClick={() => loginHandler()}>
      Google Login
    </button>
  );
}
