import React, { Component } from 'react';
import api from './api';

export default class Parcels extends Component {
  state = {
    parcels: null,
  }

  async componentDidMount() {
    const { data: parcels } = await api.get('/parcels');
    this.setState({ parcels });
  }

  render() {
    const { parcels } = this.state;
    return (
      <div className="p-3 container parcels">
        <h3>Parcels</h3>
        <div className="py-4 parcels-container">
          {parcels === null && <div>Loading</div> }
          {parcels && !parcels.length && <div>No parcels</div> }
          {!!parcels && parcels.map(parcel => (
            <div className="card my-3" key={parcel.id} style={{ width: '18rem' }}>
              <div className="card-body">
                <h5 className="card-title">{parcel.from} &rarr; {parcel.to}</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
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
