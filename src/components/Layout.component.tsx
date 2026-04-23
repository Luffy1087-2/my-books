import useGetUserByUserToken from '../hook/useGetUserByUserToken.hook';
import NavBar from './NavBar.component';
import UserBar from './UserBar.component';
import { Outlet } from 'react-router-dom';
import { useContext, useState } from 'react';
import { UserContext } from '../state/UserContext';
import { UserEntityModel } from '@my-books/core';

export default function Layout() {
  const userContext = useContext(UserContext);
  const [user, setUserState] = useState<UserEntityModel | null>(userContext);
  useGetUserByUserToken(user, setUserState);

  return (
    <UserContext.Provider value={user}>
      <div>
        <header>
          <UserBar setUserState={setUserState} />
        </header>
        <main>
          <NavBar></NavBar>
          <Outlet />
        </main>
        <footer>
          <p>&copy; 2026 My App</p>
        </footer>
      </div>
    </UserContext.Provider>
  )
}
