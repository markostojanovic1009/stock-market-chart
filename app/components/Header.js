import React from 'react';
import { IndexLink, Link } from 'react-router';

class Header extends React.Component {
  componentDidMount() {
    // Initialize Foundation
    $(document).foundation();
  }

  render() {
    return (
      <div className="top-bar">
        <div className="top-bar-title">
          <span data-responsive-toggle="responsive-menu" data-hide-for="medium">
            <span className="menu-icon light" data-toggle></span>
          </span>
          <IndexLink to="/">Chart Stock Market</IndexLink>
        </div>
        <div id="responsive-menu">
          <div className="top-bar-left">
            <ul className="vertical medium-horizontal menu">
              <li><IndexLink to="/" activeClassName="active">Home</IndexLink></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
