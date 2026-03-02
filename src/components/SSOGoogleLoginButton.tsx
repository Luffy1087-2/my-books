import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { TUserContext, UserContext } from "../state/UserContext";
import { encryptToken, CLIENT_ID } from '@my-books/core';

export function SSOGoogleLoginButton() {
  const userContext = useContext(UserContext);
  if (userContext && Object.keys(userContext).length > 1) {
    // check if the user is present at the db
    // else insert at db
    return null;
  }

  const onSuccess = async (res: CredentialResponse) => {
    const { credential } = res;
    if (!credential) throw new TypeError('login failed');
    const sessionData = jwtDecode(credential) satisfies TUserContext;
    sessionStorage.setItem('userToken', encryptToken(JSON.stringify(sessionData)));
    userContext?.setUserState({...sessionData, setUserState: userContext.setUserState})
  };

  const onError = () => {
    userContext?.setUserState(null);
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