import React from 'react';

import View from '../components/View';


export default class ErrorPage extends React.Component {
  render() {
    return (
      <View spaceBetween={true} {...this.props}>
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
      </View>
    );
  }
}

ErrorPage.propTypes = {
  uninstallAddon: React.PropTypes.func,
  sendToGA: React.PropTypes.func,
  openWindow: React.PropTypes.func
};
