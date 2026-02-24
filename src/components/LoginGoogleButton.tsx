import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { TUserContext, UserContext } from "../state/UserContext";

const clientId = process.env.REACT_APP_SSO_CLIENT_ID ?? '';
export function LoginGoogleButton() {
  const userContext = useContext(UserContext);
  const onSuccess = (res: CredentialResponse) => {
    const { credential } = res;
    if (!credential) throw new TypeError('login failed');
    const sessionData = jwtDecode(credential) satisfies TUserContext;
    localStorage.setItem('user', JSON.stringify(sessionData));
    userContext?.setUserState({...sessionData, setUserState: userContext.setUserState})
  };

  const onError = () => {
    console.log('login onError');
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
      />
    </GoogleOAuthProvider>
  );
}