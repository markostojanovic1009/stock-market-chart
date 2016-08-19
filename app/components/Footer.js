import React from 'react';

class Footer extends React.Component {
  render() {
    return (
      <footer>
        <p>© 2016 Marko Stojanovic. All Rights Reserved. Charts provided by
          <a href="http://highcharts.com">Highcharts</a>. Stock Market data provided
          by <a href="http://www.quandl.com">Quandl</a>.
        </p>
      </footer>
    );
  }
}

export default Footer;
