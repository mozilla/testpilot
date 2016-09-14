import React from 'react';

import Clipboard from 'clipboard';

import Header from './Header';
import Footer from './Footer';

const clipboard = new Clipboard('button');
clipboard.on('success', e => {
  console && console.debug('Copied', e.text);
});

export default function SharePage() {
  return (
    <div className="full-page-wrapper space-between">
      <Header />
      <div className="centered-banner">
        <div id="share" className="modal delayed-fade-in">
          <div className="modal-content">
            <p data-l10n-id="sharePrimary">Love Test Pilot? Help us find some new recruits.</p>
            <ul className="share-list">
              <li className="share-facebook"><a href="https://www.facebook.com/sharer/sharer.php?u=https%3A//testpilot.firefox.com" target="_blank">Facebook</a></li>
              <li className="share-twitter"><a href="https://twitter.com/home?status=https%3A//testpilot.firefox.com" target="_blank">Twitter</a></li>
              <li className="share-email"><a href="mailto:?body=https%3A//testpilot.firefox.com" data-l10n-id="shareEmail">E-mail</a></li>
            </ul>
            <p data-l10n-id="shareSecondary">or just copy and paste this link...</p>
            <fieldset className="share-url-wrapper">
              <div className="share-url">
                <input type="text" readOnly value="https://testpilot.firefox.com" />
                <button data-l10n-id="shareCopy" data-clipboard-target=".share-url input">Copy</button>
              </div>
            </fieldset>
          </div>
        </div>
        <div className="copter-wrapper">
          <div className="copter fade-in-fly-up"></div>
        </div>
      </div>
      <footer id="main-footer" className="content-wrapper">
        <Footer />
      </footer>
    </div>
  );
}
