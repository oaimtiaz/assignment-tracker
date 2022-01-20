import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from "@auth0/auth0-react";
import secrets from "./private/env_secrets";
import apiData from './components/ApiData';

const { AUTH_HOST, AUTH_CLIENT_ID } = secrets;
const { API_HOST, API_PORT } = apiData;

ReactDOM.render(
  <Auth0Provider domain={AUTH_HOST} clientId={AUTH_CLIENT_ID}
   redirectUri={window.location.origin}
   scope="read:assignments write:assignments"
   audience={API_HOST}
   >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
