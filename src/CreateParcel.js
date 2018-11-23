import React, { Component } from 'react';
import { navigate } from '@reach/router/lib/history';
import api from './api';

export default class CreateParcel extends Component {
  state = {
    data: {},
  }

  handleChange = x => (e) => {
    this.setState(({ data }) => ({ data: { ...data, [x]: e.target.value } }));
    e.persist();
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { data, status, error } = await api.post('/parcels', this.state.data);
    if (status === 200) {
      console.log(data);
      navigate('/parcels');
    } else {
      console.log(error);
    }
  }

  render() {
    return (
      <div className="container create-parcel">
        <form className="p-4" onSubmit={ this.handleSubmit }>
          <div className="form-group col-md-6">
            <label htmlFor="from">From</label>
            <input type="text" onChange={this.handleChange('from')} value={this.state.from} className="form-control" id="from" />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="to">Destination</label>
            <input type="text" onChange={this.handleChange('to')} value={this.state.to} className="form-control" id="to" />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="weight">Size of Good (kg)</label>
            <input type="number" onChange={this.handleChange('weight')} value={this.state.weight} className="form-control" id="weight" />
          </div>
          <button type="submit" className="btn btn-primary">
            Create Parcel
          </button>
        </form>
      </div>
    );
  }
}
