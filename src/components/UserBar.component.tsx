import { UserEntityModel } from '@my-books/core';
import { SSOGoogleLoginButton } from './SSOGoogleLoginButton';
import { useContext } from 'react';
import { UserContext } from '../state/UserContext';

export default function UserBar({ setUserState }: {
  setUserState: (sessionData: UserEntityModel | null) => void
}) {
  const user = useContext(UserContext);

  return (
    <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg shadow-md">
      {!sessionStorage.getItem('userToken') && (
        <SSOGoogleLoginButton
          setUserState={setUserState}
        />
      )}
      {user && (
        <div className="flex items-center space-x-4">
          <img
            src={user.avatarUrl}
            alt="Avatar"
            className="w-10 h-10 rounded-full"
          />
          <h1 className="text-xl font-semibold text-gray-800">
            Ciao, {user.name}!
          </h1>
        </div>
      )}
    </div>
  );
}
