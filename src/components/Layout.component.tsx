import { Outlet } from 'react-router-dom';
import NavBar from './NavBar.component';
import { ApolloProvider } from '@apollo/client/react';
import { clientService } from '../service/client.service';
import { UserContext } from '../state/UserContext';
import { UserEntityModel } from '@my-books/core';
import { useContext, useState } from 'react';
import UserBar from './UserBar.component';

export default function Layout() {
  const userContext = useContext(UserContext);
  const [user, setUserState] = useState<UserEntityModel | null>(userContext);

  return (
    <UserContext.Provider value={user}>
      <ApolloProvider client={clientService}>
        <div>
          <header>
            <UserBar user={user} setUserState={setUserState} />
          </header>
          <main>
            <NavBar></NavBar>
            <Outlet />
          </main>
          <footer>
            <p>&copy; 2026 My App</p>
          </footer>
        </div>
      </ApolloProvider>
    </UserContext.Provider>
  );
};