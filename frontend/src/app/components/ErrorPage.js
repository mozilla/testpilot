import React from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';

export default class ErrorPage extends React.Component {
  render() {
    return (
      <div className="full-page-wrapper space-between">
        <Header {...this.props} />
        <div className="centered-banner">
          <div id="four-oh-four" className="modal delayed-fade-in">
            <h1 data-l10n-id="errorHeading" className="title">Whoops!</h1>
            <div className="modal-content">
              <p data-l10n-id="errorMessage">Looks like we broke something. <br /> Maybe try again later.</p>
            </div>
          </div>
          <div className="copter-wrapper">
            <div className="copter fade-in-fly-up"></div>
          </div>
        </div>
        <footer id="main-footer" className="content-wrapper">
          <Footer {...this.props} />
        </footer>
      </div>
    );
  }
}
