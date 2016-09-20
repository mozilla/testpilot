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
        <Header forceHideSettings={ false } />
        <div className="centered-banner restart-message">
          <p data-l10n-id="restartRequiredSubHeader">Almost done . . .</p>
          { this.renderSubtitle() }
        </div>
        <footer id="main-footer" className="content-wrapper">
          <Footer />
        </footer>
      </div>
    );
  }
}
