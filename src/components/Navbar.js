import React, { Component } from 'react';

class Navbar extends Component {
    render() {
        return (
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.awkwardlysocial.io"
            target="_blank"
            rel="noopener noreferrer"
          >
           Awkwardly Social 
          </a>
          <li className="nav-item text-nowrap d-none d-sm d-sm-block">
            <small id="account" className="account-address">{this.props.account}</small>
          </li>
        </nav>
        );
    }
}
export default Navbar;