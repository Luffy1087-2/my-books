import logo from './logo.svg';
import './App.css';
import { useState, useContext } from 'react';
import { SSOGoogleLoginButton } from './components/SSOGoogleLoginButton';
import { UserContext } from './state/UserContext';
import { UserEntityModel } from '@my-books/core';

function App() {
  const userContext = useContext(UserContext);
  const [ user, setAppState ] = useState<UserEntityModel | null>(userContext);
  console.log(user)
  return (
    <UserContext.Provider value={user}>
      <div className="App">
        <SSOGoogleLoginButton refreshAppState={setAppState} />
        {user && <h1>{user.name}</h1>}
      </div>
    </UserContext.Provider>
  );
}

export default App;
