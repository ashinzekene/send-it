import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Router } from '@reach/router';
import App from './App';
import Home from './Home';
import Parcels from './Parcels';
import './App.css';

const AppRouter = () => (
  <Router>
    <App path="/">
      <Home path="/" />
      <Parcels path="/parcels" />
    </App>
  </Router>
);

render(<AppRouter />, window.document.getElementById('app'));
