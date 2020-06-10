import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Home from './Home';

class App extends Component {
  state = {};

  componentDidMount() {
    //fetch the users if logged in
    this.props.fetchUser();
    //get the analytics data
    this.props.fetchAnalytics();
  }

  render() {
    return (
      <div className="container">
        <BrowserRouter>
          <Route path="/" exact component={Home} />
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null, actions)(App);
