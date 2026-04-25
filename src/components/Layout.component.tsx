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
      <div className='min-h-screen flex flex-col'>
        <header>
          <UserBar setUserState={setUserState} />
        </header>
        <main className='flex flex-1 flex-row my-0 gap-3'>
          <div className='flex'>
            <NavBar />
          </div>
          <div className='content w-full text-center pt-2'>
            <Outlet />
          </div>
        </main>
        <footer className='fixed bottom-0 right-0 mr-2'>
          <p>&copy; 2026 My Books</p>
        </footer>
      </div>
    </UserContext.Provider>
  )
}
