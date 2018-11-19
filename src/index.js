import 'babel-polyfill';
import React, { useReducer } from 'react';
import { render } from 'react-dom';
import { Router } from '@reach/router';
import App from './App';
import Home from './Home';
import Auth from './Auth';
import Parcels from './Parcels';
import './App.css';
import { removeToken, setToken } from './api';


const AuthContext = React.createContext({ user: {} });

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN': {
      setToken(action.payload.token);
      return { user: action.payload, oo: {} };
    }
    case 'LOGOUT': {
      removeToken();
      return { ...state, user: null };
    }
    default: {
      return state;
    }
  }
};

const AppRouter = () => {
  console.log(typeof useReducer);
  const [{ user }, dispatch] = useReducer(reducer, { user: {} });

  return (
    <AuthContext.Provider value={{}}>
      <Router>
        <App path="/">
          <Home path="/" />
          <Parcels path="/parcels" />
          <Auth state={user} authenticate={dispatch} path="/create" />
        </App>
      </Router>
    </AuthContext.Provider>
  );
};

render(<AppRouter />, window.document.getElementById('app'));
