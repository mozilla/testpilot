import React from 'react';

import Footer from '../components/Footer';

export default class LegacyPage extends React.Component {
  render() {
    return (
      <div className="full-page-wrapper space-between">
        <header id="main-header" className="responsive-content-wrapper">
          <h1>
            <a href="/" className="wordmark" data-l10n-id="siteName">Firefox Test Pilot</a>
          </h1>
        </header>
        <div className="centered-banner">
          <div id="legacy-modal" className="modal delayed-fade-in">
            <div className="modal-content">
              <p>Hello there! Once upon a time, you installed an add-on called Test Pilot for Firefox.</p>
              <p>Well the Test Pilot program for trying experimental features in Firefox is back, and we thought you might like to check it out.</p>
              <p>The old add-on has been uninstalled for you. If you'd like the new one, just click the link.</p>
              <p>If you're not interested, simply close this tab and get back to browsing.</p>
            </div>
            <div className="modal-actions">
              <a className="button default large" href="/?utm_source=testpilot_legacy&utm_medium=firefox-browser">Check out Test Pilot</a>
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
