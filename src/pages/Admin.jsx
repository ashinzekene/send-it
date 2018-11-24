import React, { Component } from 'react';
import api from '../api';

export default class Admin extends Component {
  state = {
    error: '',
    parcels: null,
  }

  async componentDidMount() {
    try {
      const { data: parcels } = await api.get('/parcels');
      this.setState({ parcels });
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    const { parcels, error } = this.state;
    return (
      <div className="admin page">
        <div className="py-4 parcels-container">
          { !!error && <div className="alert alert-error">{error}</div> }
          {parcels === null && <div>Loading</div> }
          {parcels && !parcels.length && <div>No parcels</div> }
          {!!parcels && parcels.map(parcel => (
            <div className="card my-3" key={parcel.id} style={{ width: '18rem' }}>
              <div className="card-body">
                <h5 className="card-title">{parcel.from} &rarr; {parcel.to}</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card content.</p>
                <div href="#" className="label label-success">{parcel.status}</div>
                <a href="#" className="card-link">{ (new Date(parcel.senton)).toDateString()}</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
