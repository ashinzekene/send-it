import 'babel-polyfill';
import React, { useReducer } from 'react';
import { render } from 'react-dom';
import { Router, navigate } from '@reach/router';
import App from './App';
import Home from './Home';
import Auth from './Auth';
import Parcels from './Parcels';
import './App.css';
import { removeToken, setToken } from './api';

const ConditionalRoute = ({
  condition, component: Comp, redirect = '/auth', ...props
}) => {
  if (condition) return <Comp {...props} />;
  navigate(redirect);
  return [];
};

const AuthContext = React.createContext({ user: {} });

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN': {
      setToken(action.payload.token);
      return { ...state, user: action.payload };
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
  const [{ user }, dispatch] = useReducer(reducer, { user: {} });

  return (
    <AuthContext.Provider value={{}}>
      <Router>
        <App dispatch={dispatch} path="/">
          <Home path="/" />
          <Parcels path="/parcels" />
          <ConditionalRoute component={Auth} state={user} dispatch={dispatch} path="/auth" condition={!user.id} />
          <ConditionalRoute path="/users" component={Home} condition={ !!user.id } />
        </App>
      </Router>
    </AuthContext.Provider>
  );
};

render(<AppRouter />, window.document.getElementById('app'));
