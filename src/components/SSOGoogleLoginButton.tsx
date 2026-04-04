import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { UserContext } from "../state/UserContext";
import { encryptToWebToken, CLIENT_ID, GoogleUserModel, UserEntityModel } from '@my-books/core';

export function SSOGoogleLoginButton(
  {refreshAppState}: {
    refreshAppState: (sessionData: UserEntityModel | null) => void
  }) {
  const userContext = useContext(UserContext);
  if (userContext && Object.keys(userContext).length > 1) {
    return null;
  }

  const mapToUserEntityModel = (googleModel: GoogleUserModel): UserEntityModel => {
    return {
      id: Number(googleModel.sub),
      email: googleModel.email,
      name: googleModel.given_name,
      role: 'admin'
    };
  }

  const onSuccess = async (res: CredentialResponse) => {
    const { credential } = res;
    if (!credential) throw new TypeError('login failed');
    const googleUserModel = jwtDecode(credential) satisfies GoogleUserModel;
    const userEntityModel = mapToUserEntityModel(googleUserModel); // Here should be a mutation call
    const userDataString = JSON.stringify(userEntityModel);
    const encryptedUserToken = encryptToWebToken(userDataString);
    console.log(encryptedUserToken);
    sessionStorage.setItem('userToken', encryptedUserToken);
    // Call Create Or Get USer
    refreshAppState(userEntityModel);
  };

  const onError = () => {
    refreshAppState(null);
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