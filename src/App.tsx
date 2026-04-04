import { useState, useContext } from 'react';
import { SSOGoogleLoginButton } from './components/SSOGoogleLoginButton';
import { UserContext } from './state/UserContext';
import { UserEntityModel } from '@my-books/core';
import { ApolloProvider } from '@apollo/client/react';
import { clientService } from './service/client.service';

function App() {
  const userContext = useContext(UserContext);
  const [ user, setLoginState ] = useState<UserEntityModel | null>(userContext);

  return (
    <ApolloProvider client={clientService}>
      <UserContext.Provider value={user}>
        <div className="App">
          <SSOGoogleLoginButton refreshAppState={setLoginState} />
          {user && <h1>{user.name}</h1>}
        </div>
      </UserContext.Provider>
    </ApolloProvider>
  );
}

export default App;
