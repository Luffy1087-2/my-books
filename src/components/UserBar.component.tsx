import { UserEntityModel } from '@my-books/core';
import { SSOGoogleLoginButton } from './SSOGoogleLoginButton';

export default function UserBar({ user, setUserState }: {
  user: UserEntityModel | null,
  setUserState: (sessionData: UserEntityModel | null) => void
}) {

  return (
    <div>
      {!user && <SSOGoogleLoginButton setUserState={setUserState} />}
      {user && <h1>{user.name}</h1>}
    </div>
  );
}
