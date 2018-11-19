import React from 'react';
import { Link } from '@reach/router';

const Header = () => (
  <nav className="navbar navbar-light d-flex justify-content-between navbar-expand-sm bg-white">
    <h2 className="font-weight-bold">
      <Link className="navbar-brand" to="/">Send It</Link>
    </h2>
    <div>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse">
        <div className="navbar-nav">
          <Link className="nav-item nav-link active" to="/">Home <span className="sr-only">(current)</span></Link>
          <Link className="nav-item nav-link" to="/create">Create Parcel</Link>
          <Link className="nav-item nav-link" to="/parcels">Parcels</Link>
          <Link className="nav-item nav-link" to="/auth">Login/Sign Up</Link>
        </div>
      </div>
    </div>
  </nav>
);

export default Header;
