import React from 'react';

import Clipboard from 'clipboard';

import { sendToGA } from '../lib/utils';

import Header from './Header';
import Footer from './Footer';

const clipboard = new Clipboard('button');
clipboard.on('success', e => {
  console && console.debug('Copied', e.text);
});


function shareUrl(medium, urlencode) {
  const url = `https://testpilot.firefox.com/?utm_source=${medium}&utm_medium=social&utm_campaign=share-page`;
  return urlencode ? encodeURIComponent(url) : url;
}


function handleClick(label) {
  return () => {
    sendToGA('event', {
      eventCategory: 'ShareView Interactions',
      eventAction: 'button click',
      eventLabel: label
    });
  };
}


export default function SharePage() {
  return (
    <div className="full-page-wrapper space-between">
      <Header />
      <div className="centered-banner">
        <div id="share" className="modal delayed-fade-in">
          <div className="modal-content">
            <p data-l10n-id="sharePrimary">Love Test Pilot? Help us find some new recruits.</p>
            <ul className="share-list">
              <li className="share-facebook"><a href={'https://www.facebook.com/sharer/sharer.php?u=' + shareUrl('facebook', true)} onClick={handleClick('facebook')} target="_blank">Facebook</a></li>
              <li className="share-twitter"><a href={'https://twitter.com/home?status=' + shareUrl('twitter', true)} onClick={handleClick('twitter')} target="_blank">Twitter</a></li>
              <li className="share-email"><a href={'mailto:?body=' + shareUrl('email', true)} data-l10n-id="shareEmail" onClick={handleClick('email')}>E-mail</a></li>
            </ul>
            <p data-l10n-id="shareSecondary">or just copy and paste this link...</p>
            <fieldset className="share-url-wrapper">
              <div className="share-url">
                <input type="text" readOnly value={shareUrl('copy', false)} />
                <button data-l10n-id="shareCopy" onClick={handleClick('copy')} data-clipboard-target=".share-url input">Copy</button>
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
