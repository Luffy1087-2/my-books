import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { UserContext } from "../state/UserContext";
import { encryptToken, CLIENT_ID, UserEntityModel } from '@my-books/core';

export function SSOGoogleLoginButton(
  {refreshAppState}: {
    refreshAppState: (sessionData: UserEntityModel | null) => void
  }) {
  const userContext = useContext(UserContext);
  if (userContext && Object.keys(userContext).length > 1) {
    return null;
  }

  const onSuccess = async (res: CredentialResponse) => {
    const { credential } = res;
    if (!credential) throw new TypeError('login failed');
    const sessionData = jwtDecode(credential) satisfies UserEntityModel
    sessionStorage.setItem('userToken', encryptToken(JSON.stringify(sessionData)));
    // Call Create Or Get USer
    refreshAppState(sessionData);
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