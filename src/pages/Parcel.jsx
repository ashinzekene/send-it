import React, { Component } from 'react';
import api from '../api';

export default class Parcel extends Component {
  state = {
    parcel: null,
    error: false,
  }

  async componentDidMount() {
    const { parcelId } = this.props;
    try {
      const { data: parcel } = await api.get(`/parcels/${parcelId}`);
      this.setState({ parcel: parcel[0] });
    } catch (err) {
      this.setState({ error: true });
    }
  }

  render() {
    const { parcel } = this.state;
    return (
      <div className="single-parcel">
        {this.state.parcel === null ? <div>Loading...</div>
          : <div className="parcel">
          <div className="locations d-flex">
            <h3>{ parcel.from }</h3>
            <h3>&rarr;</h3>
            <h3>{ parcel.to }</h3>
          </div>
          <div className="status">{parcel.currentlocation}</div>
          <div className="status label">{parcel.status}</div>
          <div className="date">Date: {(new Date(parcel.senton)).toDateString()}</div>
          </div>
        }
      </div>
    );
  }
}
