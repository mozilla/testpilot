import React from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';


export default class Restart extends React.Component {
  componentWillMount() {
    this.props.sendToGA('event', {
      eventCategory: 'PostInstall Interactions',
      eventAction: 'view modal',
      eventLabel: 'restart required'
    });
  }

  renderSubtitle() {
    const { experimentTitle } = this.props;
    if (experimentTitle) {
      return (
        <h2 data-l10n-id="restartRequiredFromExperiment">
           data-l10n-args={JSON.stringify({ experimentTitle })}
          Please restart Firefox <br/> to enable { experimentTitle }.
        </h2>
      );
    }
    return (
      <h2 data-l10n-id="restartRequiredFromLanding">
        Please restart Firefox <br/> to choose your features.
      </h2>
    );
  }

  render() {
    return (
      <div className="full-page-wrapper space-between">
        <Header {...this.props} />
        <div className="centered-banner restart-message">
          <p data-l10n-id="restartRequiredSubHeader">Almost done . . .</p>
          { this.renderSubtitle() }
        </div>
        <footer id="main-footer" className="content-wrapper">
          <Footer {...this.props} />
        </footer>
      </div>
    );
  }
}

Restart.propTypes = {
  experimentTitle: React.PropTypes.string,
  hasAddon: React.PropTypes.bool,
  sendToGA: React.PropTypes.func,
  openWindow: React.PropTypes.func
};
