import React, { Component, Fragment } from 'react';
import { navigate } from '@reach/router/lib/history';
import api from './api';

export default class Auth extends Component {
  state = {
    login: true,
    data: {},
  }

  handleChange = x => (e) => {
    this.setState(({ data }) => ({ data: { ...data, [x]: e.target.value } }));
    e.persist();
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    let url = '/auth/signup';
    if (this.state.login) {
      url = '/auth/login';
    }
    const { data, status, error } = await api.post(url, this.state.data);
    if (status === 200) {
      this.props.dispatch({ type: 'LOGIN', payload: data[0] });
      navigate('/');
    } else {
      console.log(error);
    }
  }

  switch = () => this.setState(({ login }) => ({ login: !login }))

  render() {
    return (
      <div className="container create-parcel">
        <button className="btn btn-secondary" onClick={this.switch}>{ this.state.login ? 'Sign up instead' : 'Login instead' }</button>
        <form className="p-4" onSubmit={ this.handleSubmit }>
          { this.state.login ? (
            <Fragment>
              <div className="form-group col-md-6">
                <label htmlFor="address">Email Address</label>
                <input onChange={this.handleChange('email')} value={this.state.address} type="email" className="form-control" id="address" />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="password">Password</label>
                <input onChange={this.handleChange('password')} value={this.state.password} type="password" className="form-control" id="password" />
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className="form-group col-md-6">
                <label htmlFor="first-name">First Name</label>
                <input onChange={this.handleChange('first')} value={this.state.first} type="text" className="form-control" id="first-name" placeholder="First Name" />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="lastname">Last Name</label>
                <input onChange={this.handleChange('lastname')} value={this.state.lastname} type="text" className="form-control" id="lastname" />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="address">Email Address</label>
                <input onChange={this.handleChange('email')} value={this.state.address} type="email" className="form-control" id="address" />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="password">Password</label>
                <input onChange={this.handleChange('password')} value={this.state.password} type="password" className="form-control" id="password" />
              </div>
              <div className="form-check">
                <input onChange={this.handleChange('isAdmin')} value={this.state.isAdmin} className="form-check-input" type="radio" id="is-admin" checked/>
                <label className="form-check-label" htmlFor="is-admin">
                  Admin?
                </label>
              </div>
            </Fragment>
          )}
          <button type="submit" className="btn btn-primary">
            { this.state.login ? 'Sign up' : 'Login' }
          </button>
        </form>
      </div>
    );
  }
}
