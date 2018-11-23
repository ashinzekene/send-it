import 'babel-polyfill';
import React, { useReducer } from 'react';
import { render } from 'react-dom';
import { Router, navigate } from '@reach/router';
import App from './App';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Parcels from './pages/Parcels';
import CreateParcel from './pages/CreateParcel';
import Admin from './pages/Admin';
import './App.css';
import { removeToken, setToken } from './api';
<<<<<<< Updated upstream
=======
import { AuthProvider } from './context';
import Parcel from './pages/Parcel';
>>>>>>> Stashed changes

const ConditionalRoute = ({
  condition, errorText, component: Comp, redirect = '/auth', ...props
}) => {
  if (condition) {
    return (
      <Comp
        error={errorText || 'Not authenticated'}
        {...props}
      />
    );
  }
  navigate(redirect);
  return [];
};

<<<<<<< Updated upstream
const AuthContext = React.createContext({ user: {} });

=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
          <Parcels path="/parcels" />
          <ConditionalRoute component={Auth} state={user} dispatch={dispatch} path="/auth" condition={!user.id} />
          <ConditionalRoute path="/users" component={Home} condition={ !!user.id } />
=======
          <Parcels dispatch={dispatch} path="parcels" />
          <ConditionalRoute
            dispatch={dispatch}
            component={Auth}
            state={user}
            path="auth"
            redirect="/"
            condition={!user.id}
          />
          <ConditionalRoute
            dispatch={dispatch}
            path="users"
            state={user}
            component={Home}
            condition={!!user.id}
          />
          <ConditionalRoute
            dispatch={dispatch}
            path="my-parcels"
            state={user}
            component={Parcels}
            condition={!!user.id}
          />
          <Parcel path="parcels/:parcelId" />
          <ConditionalRoute
            dispatch={dispatch}
            path="create"
            state={user}
            component={CreateParcel}
            condition={!!user.id}
          />
          <ConditionalRoute
            dispatch={dispatch}
            path="admin"
            state={user}
            component={Admin}
            condition={!!user.isadmin}
          />
>>>>>>> Stashed changes
        </App>
      </Router>
    </AuthContext.Provider>
  );
};

render(<AppRouter />, window.document.getElementById('app'));
