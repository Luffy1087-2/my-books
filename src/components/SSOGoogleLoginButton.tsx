import { useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { encryptToWebToken, getEnvByKey, GoogleUserModel, UserEntityModel } from '@my-books/core';
import useCreateUserIfNotExists from '../hook/useCreateUserIfNotExists.hook';

export function SSOGoogleLoginButton({ setUserState }: {
  setUserState: (sessionData: UserEntityModel | null) => void
}) {
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  useCreateUserIfNotExists(googleToken, setUserState);

  const onSuccess = async (res: CredentialResponse) => {
    const { credential } = res;
    if (!credential) throw new TypeError('login failed');
    const googleUserModel = jwtDecode(credential) satisfies GoogleUserModel;
    const googleJsonString = JSON.stringify(googleUserModel);
    const encryptedGoogleToken = encryptToWebToken(googleJsonString);
    setGoogleToken(encryptedGoogleToken);
  };

  const onError = () => {
    setUserState(null);
  };

  return (
    <GoogleOAuthProvider clientId={getEnvByKey('SSO_CLIENT_ID')}>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
      />
    </GoogleOAuthProvider>
  );
}
