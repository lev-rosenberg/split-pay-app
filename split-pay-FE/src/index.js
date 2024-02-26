import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ContextProvider } from './contexts/userContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

 
const root = ReactDOM.createRoot(document.getElementById('root'));
const clientId = "751483933522-h2kmu7me04v2d2a5vtljp9vb4dc0qvuf.apps.googleusercontent.com"
root.render(
  <GoogleOAuthProvider clientId={clientId}>
    <React.StrictMode>
      <ContextProvider>
        <App />
      </ContextProvider>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
