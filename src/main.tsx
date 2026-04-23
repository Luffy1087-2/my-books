import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import { router } from './config/router.config';
import { clientService } from './service/client.service';
import { ApolloProvider } from '@apollo/client/react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={clientService}>
      <GoogleOAuthProvider clientId={'193354855911-bi08a0fq7dob3jh6asgg06a93d4l1ser.apps.googleusercontent.com'}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
