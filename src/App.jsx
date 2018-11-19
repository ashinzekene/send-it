import React from 'react';
import Header from './components/Header';

const App = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    // dispatch({ type: 'LOGIN' })
  }
  return (
  <div>
    <Header />
    {children}
  </div>
  );
};

export default App;
