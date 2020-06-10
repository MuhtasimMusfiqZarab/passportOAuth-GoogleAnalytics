import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';

class Header extends Component {
  //rendering the header according to the auth value
  renderContent() {
    console.log(this.props.analytics);
    switch (this.props.auth) {
      case null:
        return 'Processing';
      case false:
        return <a href="/auth/google">Login with google</a>;
      default:
        return <a href="/api/logout">Logout</a>;
    }
    //showing the analytics data in a div
  }

  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li>{this.renderContent()}</li>
          </ul>
        </div>
      </nav>
    );
  }
}

function mapStateToProps({ auth, analytics }) {
  return {
    auth,
    analytics,
  };
}

export default connect(mapStateToProps)(Header);
