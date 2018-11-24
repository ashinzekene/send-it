import React, { Component } from 'react';
// import Icon from '../components/Icon';
// import parcelSvg from '../components/svgs/ParcelIcon';
import './Home.css';

export default class Home extends Component {
  onClick = () => {}

  render() {
    return (
      <div className="hero d-flex flex-wrap p-3 align-items-center page">
        <div className="text-content">
          <h1 className="display-2 w-100">Send IT</h1>
          <h2 className=" font-italic">Make orders, track your parcels easily...</h2>
        </div>
        {/* <Icon className="d-none d-md-block parcel-icon mr-3 mt-4" icon={parcelSvg}></Icon> */}
      </div>
    );
  }
}
