import React from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';

import { sendToGA } from '../lib/utils';


export default class Restart extends React.Component {
  componentWillMount() {
    sendToGA('event', {
      eventCategory: 'PostInstall Interactions',
      eventAction: 'view modal',
      eventLabel: 'restart required'
    });
  }

  renderSubtitle() {
    const { experimentTitle } = this.props;
    if (experimentTitle) {
      return (
        <p data-l10n-id="restartRequiredFromExperiment">
           data-l10n-args={JSON.stringify({ experimentTitle })}
          Restart Firefox to enable { experimentTitle }.
        </p>
      );
    }
    return (
      <p data-l10n-id="restartRequiredFromLanding">
        Restart Firefox to choose your features.
      </p>
    );
  }

  render() {
    return (
      <div className="full-page-wrapper space-between">
        <Header forceHideSettings={ false } />
        <div className="centered-banner restart-message">
          <h2 data-l10n-id="restartRequiredHeader">Test Pilot Installed!</h2>
          { this.renderSubtitle() }
        </div>
        <footer id="main-footer" className="content-wrapper">
          <Footer />
        </footer>
      </div>
    );
  }
}
