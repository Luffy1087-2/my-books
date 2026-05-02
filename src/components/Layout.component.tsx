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
        <main className='flex flex-1 flex-row my-0'>
          <div className='flex'>
            <NavBar className='bg-gray-100 p-4 flex flex-1 flex-col gap-2 mt-1 w-60' />
          </div>
          <div className='content w-8/12 text-center mt-1.5 mx-auto'>
            <div className="flex flex-row bg-[url('../../public/images/shelf2.jpg')] bg-size-[100%_100%] h-50 w-full"></div>
            <Outlet />
          </div>
        </main>
        <footer className='fixed bottom-0 right-0 mr-2'>
          <p>&copy; 2026 My Books</p>
        </footer>
      </div >
    </UserContext.Provider >
  )
}
