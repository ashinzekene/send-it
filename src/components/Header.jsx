import React from 'react';
import { Link } from '@reach/router';

const Header = () => (
  <AuthConsumer>
    {
      ({ user, dispatch }) => (
        <React.Fragment>
          <nav className="navbar navbar-light d-flex justify-content-between navbar-expand-sm bg-white">
          <h2 className="font-weight-bold">
            <NavLink className="navbar-brand font-weight-normal" to="/">Send It</NavLink>
          </h2>
          <div>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse">
              <div className="navbar-nav">
                <NavLink className="nav-item nav-link" to="/">Home <span className="sr-only">(current)</span></NavLink>
                {!!user.isadmin && <NavLink className="nav-item nav-link" to="/admin">Admin</NavLink>}
                {!!user.id && <NavLink className="nav-item nav-link" to="/my-parcels">My Parcels</NavLink>}
                {!!user.id && <NavLink className="nav-item nav-link" to="/create">Create Parcel</NavLink>}
                <NavLink className="nav-item nav-link" to="/parcels">All Parcels</NavLink>
                {!user.id && <NavLink className="nav-item nav-link" to="/auth">Login/Sign Up</NavLink>}
                {!!user.id && <button className="nav-item btn btn-danger" onClick={() => dispatch({ type: 'LOGOUT' })} to="/auth">Log out</button>}
              </div>
            </div>
          </div>
        </nav>
        <div style={{ marginBottom: '90px' }}></div>
      </React.Fragment>
      )
      }
  </AuthConsumer>
);

export default Header;
