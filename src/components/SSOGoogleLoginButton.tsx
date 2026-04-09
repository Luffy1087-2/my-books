import { useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { encryptToWebToken, CLIENT_ID, GoogleUserModel, UserEntityModel } from '@my-books/core';
import useCreateUserIfNotExists from '../hook/useCreateUserIfNotExists.hook';

export function SSOGoogleLoginButton({ setUserState }: {
  setUserState: (sessionData: UserEntityModel | null) => void
}) {
  const [userToken, setUserToken] = useState<string | null>(null);
  useCreateUserIfNotExists(userToken, setUserState);

  const mapToUserEntityModel = (googleModel: GoogleUserModel): UserEntityModel => {
    return {
      gId: googleModel.sub,
      email: googleModel.email,
      name: googleModel.given_name,
      role: 'admin'
    };
  }

  const onSuccess = async (res: CredentialResponse) => {
    const { credential } = res;
    if (!credential) throw new TypeError('login failed');
    const googleUserModel = jwtDecode(credential) satisfies GoogleUserModel;
    const userEntityModel = mapToUserEntityModel(googleUserModel);
    const userEntityString = JSON.stringify(userEntityModel);
    const encryptedEntityModelToken = encryptToWebToken(userEntityString);
    setUserToken(encryptedEntityModelToken);
  };

  const onError = () => {
    setUserState(null);
    sessionStorage.removeItem('userToken');
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
      />
    </GoogleOAuthProvider>
  );
}