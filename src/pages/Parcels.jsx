import React, { Component } from 'react';
import { Link } from '@reach/router';
import api from '../api';

export default class Parcels extends Component {
  state = {
    parcels: null,
    error: false,
  }

  async componentDidMount() {
    this.setState({ error: true });
    try {
      const { data: parcels } = await api.get('/parcels');
      this.setState({ parcels });
    } catch (err) {
      this.setState({ error: true });
    }
  }

  render() {
    const { parcels, error } = this.state;
    return (
      <div className="p-3 container parcels page">
        <h3>Parcels</h3>
        <div className="py-4 parcels-container">
          {parcels === null && <div>Loading</div> }
          {error === null && <div>An error occurred while fetching parcels</div> }
          {parcels && !parcels.length && <div>No parcels</div> }
          {!!parcels && parcels.map(parcel => (
            <Link to={`/parcels/${parcel.id}`} className="card parcel my-3" key={parcel.id}>
              <div className="card-body">
                <h5 className="card-title">{parcel.from} &rarr; {parcel.to}</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card content.</p>
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
