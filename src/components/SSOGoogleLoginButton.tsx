import { useState } from 'react';
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { UserEntityModel } from '@my-books/core';
import useCreateUserIfNotExists from '../hook/useCreateUserIfNotExists.hook';

const ssoGoogleClientId = '193354855911-bi08a0fq7dob3jh6asgg06a93d4l1ser.apps.googleusercontent.com';
export function SSOGoogleLoginButton({ setUserState }: {
  setUserState: (sessionData: UserEntityModel | null) => void
}) {
  const [jwtGoogleToken, setJwtGoogleToken] = useState<string | null>(null);
  useCreateUserIfNotExists(jwtGoogleToken, setUserState);

  const onSuccess = async (res: CredentialResponse) => {
    const { credential } = res;
    if (!credential) throw new TypeError('login failed');
    setJwtGoogleToken(credential);
  };

  const onError = () => {
    setUserState(null);
  };

  return (
    <GoogleOAuthProvider clientId={ssoGoogleClientId}>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        ux_mode='redirect'
      />
    </GoogleOAuthProvider>
  );
}
