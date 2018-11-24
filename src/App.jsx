import React, { Component } from 'react';
import Header from './components/Header';
import api from './api';

class App extends Component {
  async componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { data } = await api.get('/auth');
        this.props.dispatch({ type: 'LOGIN', payload: data[0] });
      } catch (err) {
        console.log('Not logged in');
      }
    }
  }

  render() {
    return (
    <div style={{ height: '100%' }}>
      <Header />
      {this.props.children}
    </div>
    );
  }
}

export default App;
