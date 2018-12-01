import React, { Component } from 'react';
import { navigate } from '@reach/router/lib/history';
import CloseButton from '../components/CloseButton';
import api from '../api';
import './Auth.css';

export default class Auth extends Component {
  state = {
    signup: true,
    data: {},
    error: false,
  }

  handleChange = x => (e) => {
    this.setState(({ data }) => ({ data: { ...data, [x]: e.target.value } }));
    e.persist();
  }

  handleSubmit = async (e) => {
    this.setState({ error: false });
    e.preventDefault();
    let url = '/auth/login';
    if (this.state.signup) {
      url = '/auth/signup';
    }
    const { data, status, error } = await api.post(url, this.state.data);
    if (status === 200) {
      this.props.dispatch({ type: 'LOGIN', payload: data[0] });
      navigate('/');
    } else {
      this.setState({ error });
    }
  }

  removeAlert = () => this.setState({ error: false });

  switch = () => this.setState(({ signup }) => ({ signup: !signup }))

  render() {
    const { signup, error } = this.state;
    return (
      <div className="container create-parcel page">
        <form className="mx-auto py-3 auth-form" onSubmit={ this.handleSubmit }>
          { !!error && <div className="alert alert-danger">
              {error}
              <CloseButton onClick={this.removeAlert} />
              </div>
          }
          <h3 className="p-3">{ signup ? 'Sign Up' : 'Sign In'}</h3>
          <div className="form-group col-md-6">
            <label htmlFor="address">Email Address</label>
            <input type="email" required onChange={this.handleChange('email')} placeholder="Email" value={this.state.address} className="form-control" id="address" />
          </div>
          { signup && <div className="form-group col-md-6">
            <label htmlFor="first-name">First Name</label>
            <input type="text" required onChange={this.handleChange('first')} placeholder="First Name" value={this.state.first} className="form-control" id="first-name" />
          </div> }
          { signup && <div className="form-group col-md-6">
            <label htmlFor="lastname">Last Name</label>
            <input type="text" required onChange={this.handleChange('lastname')} placeholder="Last Name" value={this.state.lastname} className="form-control" id="lastname" />
          </div> }
          { signup && <div className="form-group col-md-6">
            <label htmlFor="othername">Other Name</label>
            <input type="text" required onChange={this.handleChange('othername')} placeholder="Other Name" value={this.state.lastname} className="form-control" id="othername" />
          </div> }
          <div className="form-group col-md-6">
            <label htmlFor="password">Password</label>
            <input type="password" required onChange={this.handleChange('password')} placeholder="Password" value={this.state.password} className="form-control" id="password" />
          </div>
          <div className="form-check">
            <input onChange={this.handleChange('isAdmin')} value={this.state.isAdmin} className="form-check-input" type="radio" id="is-admin" checked/>
            <label className="form-check-label" htmlFor="is-admin">
              Admin?
            </label>
          </div>
          <button type="submit" className="btn btn-primary mx-3">
            { this.state.signup ? 'Sign up' : 'Sign in' }
          </button>
          <button role="button" type="button" className="btn btn-secondary mx-3" onClick={this.switch}>
            { this.state.signup ? 'Sign in instead' : 'Sign up instead' }
          </button>
        </form>
      </div>
    );
  }
}
