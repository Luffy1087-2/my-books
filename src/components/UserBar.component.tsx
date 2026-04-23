import { UserEntityModel } from '@my-books/core';
import { SSOGoogleLoginButton } from './SSOGoogleLoginButton';
import { useContext } from 'react';
import { UserContext } from '../state/UserContext';

export default function UserBar({ setUserState }: {
  setUserState: (sessionData: UserEntityModel | null) => void
}) {
  const user = useContext(UserContext);

  return (
    <div>
      {!sessionStorage.getItem('userToken') && <SSOGoogleLoginButton setUserState={setUserState} />}
      {user && <h1>Hi {user.name}</h1>}
    </div>
  );
}
