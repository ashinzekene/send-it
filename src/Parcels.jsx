import React, { Component } from 'react';
import api from './api';

export default class Parcels extends Component {
  state = {
    parcels: null,
  }

  async componentDidMount() {
    const res = await api.get('/parcels');
    console.log(res);
  }

  render() {
    return (
      <div>
        <h3>Parcels</h3>
      </div>
    );
  }
}
