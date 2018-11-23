import React from 'react';
import Header from './components/Header';

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
  return (
  <div>
    <Header />
    {children}
  </div>
  );
};

export default App;
