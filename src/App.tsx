import logo from './logo.svg';
import './App.css';
import { useState, useContext } from 'react';
import { SSOGoogleLoginButton } from './components/SSOGoogleLoginButton';
import { TUserContext, UserContext } from './state/UserContext';

function App() {
  const userContext = useContext(UserContext);
  const [ user, setUserState ] = useState<TUserContext>(userContext);

  return (
    <UserContext.Provider value={{...user, setUserState}}>
      <div className="App">
        <SSOGoogleLoginButton />
        {user && <h1>{user.given_name}</h1>}
      </div>
    </UserContext.Provider>
  );
}

export default App;
