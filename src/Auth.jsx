import React, { Component } from 'react';

export default class CreateParcel extends Component {
  state = {
    create: true,
  }

  componentDidMount() {
    console.log(this.props.state);
  }

  componentDidUpdate() {
    console.log(this.props.state);
  }

  createAccount = () => {
    this.props.authenticate({ type: 'LOGIN', payload: { token: 'something', name: 'Ekene' } });
  }

  render() {
    return (
      <div className="container create-parcel">
        <form className="p-4" onSubmit={ e => e.preventDefault() }>
          <div className="form-group col-md-6">
            <label htmlFor="first-name">First Name</label>
            <input type="text" className="form-control" id="first-name" placeholder="First Name" />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="last-name">Last Name</label>
            <input type="text" className="form-control" id="last-name" placeholder="Last Name" />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="username">Username</label>
            <input type="text" className="form-control" id="username" />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="address">Email Address</label>
            <input type="email" className="form-control" id="address" />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control" id="password" />
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="exampleRadios" id="is-admin" value="option1" checked/>
            <label className="form-check-label" htmlFor="is-admin">
              Admin?
            </label>
          </div>
          <button onClick={this.createAccount} className="btn btn-primary">
            Sign in
          </button>
        </form>
      </div>
    );
  }
}
