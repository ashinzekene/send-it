import React, { Component } from 'react';
import { Link } from '@reach/router';
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
            <Link to={`/parcels/${parcel.id}`} className="card my-3" key={parcel.id} style={{ width: '18rem' }}>
              <div className="card-body">
                <h5 className="card-title">{parcel.from} &rarr; {parcel.to}</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the cards content.</p>
                <div href="#" className="badge badge-success">{parcel.status}</div>
                <div href="#" className="card-link">{ (new Date(parcel.senton)).toDateString()}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }
}
