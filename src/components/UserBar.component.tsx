import { UserEntityModel } from '@my-books/core';
import { SSOGoogleLoginButton } from './SSOGoogleLoginButton';
import useGetUserByUserToken from '../hook/useGetUserByUserToken.hook';

export default function UserBar({ user, setUserState }: {
  user: UserEntityModel | null,
  setUserState: (sessionData: UserEntityModel | null) => void
}) {
  useGetUserByUserToken(user, setUserState); // Create App Component and call it inside

  return (
    <div>
      {!sessionStorage.getItem('userToken') && <SSOGoogleLoginButton setUserState={setUserState} />}
      {user && <h1>Hi {user.name}</h1>}
    </div>
  );
}
