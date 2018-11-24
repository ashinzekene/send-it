import 'babel-polyfill';
import React, { useReducer } from 'react';
import { render } from 'react-dom';
import { Router, navigate } from '@reach/router';
import App from './App';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Parcels from './pages/Parcels';
import Parcel from './pages/Parcel';
import CreateParcel from './pages/CreateParcel';
import './App.css';
import { removeToken, setToken } from './api';
import { AuthProvider } from './context';

const ConditionalRoute = ({
  condition, path, component: Comp, redirect = '/auth', ...props
}) => {
  if (condition) return <Comp path={path} {...props} />;
  navigate(redirect);
  return [];
};


const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN': {
      setToken(action.payload.token);
      return { ...state, user: action.payload.user };
    }
    case 'LOGOUT': {
      removeToken();
      navigate('/');
      return { ...state, user: {} };
    }
    default: {
      return state;
    }
  }
};

const AppRouter = () => {
  const [{ user }, dispatch] = useReducer(reducer, { user: {} });

  return (
    <AuthProvider value={{ user, dispatch }}>
      <Router>
        <App dispatch={dispatch} path="/">
          <Home path="/" />
          <Parcels dispatch={dispatch} path="/parcels" />
          <ConditionalRoute component={Auth} state={user} dispatch={dispatch} path="/auth" redirect="/" condition={!user.id} />
          <ConditionalRoute dispatch={dispatch} path="/users" component={Home} condition={!!user.id} />
          <ConditionalRoute dispatch={dispatch} path="/my-parcels" component={Parcels} condition={!!user.id} />
          <ConditionalRoute dispatch={dispatch} path="/parcels/:id" component={Parcel} condition={!!user.id} user={user} />
          <ConditionalRoute dispatch={dispatch} path="/create" component={CreateParcel} condition={!!user.id} />
        </App>
      </Router>
    </AuthProvider>
  );
};

render(<AppRouter />, window.document.getElementById('app'));
