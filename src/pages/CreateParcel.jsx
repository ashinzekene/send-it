import React, { Component } from 'react';
import { navigate } from '@reach/router/lib/history';
import './CreateParcel.css';
import api from '../api';
import MapComponent from '../components/CreateParcelMap';

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
    const { status, error } = await api.post('/parcels', this.state.data);
    if (status === 200) {
      navigate('/parcels');
    } else {
      console.log(error);
    }
  }

  render() {
    return (
      <div className="d-flex align-items-stretch flex-nowrap create-parcel page">
        <form className="p-4 col-md-6 col-sm-12" onSubmit={ this.handleSubmit }>
          <h3 className="py-4">Create a parcel...</h3>
          <div className="form-group">
            <label htmlFor="from">From</label>
            <input required type="text" onChange={this.handleChange('from')} value={this.state.from} className="form-control" id="from" />
          </div>
          <div className="form-group">
            <label htmlFor="to">Destination</label>
            <input required type="text" onChange={this.handleChange('to')} value={this.state.to} className="form-control" id="to" />
          </div>
          <div className="form-group">
            <label htmlFor="weight">Size of Good (kg)</label>
            <input required type="number" onChange={this.handleChange('weight')} value={this.state.weight} className="form-control" id="weight" />
          </div>
          <input type="hidden" name="location" onChange={this.handleChange('weight')} value={this.state.weight} />
          <button type="submit" className="btn btn-primary">
            Create Parcel
          </button>
        </form>
        <MapComponent
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyAtMfHXFUZ5RJFyoRSh0447GV2ZHNmcXLY&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: '100%' }} />}
          containerElement={<div className="col-md-6 col-sm-12 p-0" />}
          mapElement={<div className="h-100" />}/>
      </div>
    );
  }
}
