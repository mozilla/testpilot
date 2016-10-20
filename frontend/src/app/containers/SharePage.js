import React from 'react';

import View from '../components/View';


export default class SharePage extends React.Component {
  render() {
    return (
      <View spaceBetween={true} showNewsletterFooter={false} {...this.props}>
        <div className="centered-banner">
          <div id="share" className="modal delayed-fade-in">
            <div className="modal-content">
              <p data-l10n-id="sharePrimary">Love Test Pilot? Help us find some new recruits.</p>
              <ul className="share-list">
                <li className="share-facebook"><a href={'https://www.facebook.com/sharer/sharer.php?u=' + this.shareUrl('facebook', true)} onClick={this.handleClick('facebook')} target="_blank">Facebook</a></li>
                <li className="share-twitter"><a href={'https://twitter.com/home?status=' + this.shareUrl('twitter', true)} onClick={this.handleClick('twitter')} target="_blank">Twitter</a></li>
                <li className="share-email"><a href={'mailto:?body=' + this.shareUrl('email', true)} data-l10n-id="shareEmail" onClick={this.handleClick('email')}>E-mail</a></li>
              </ul>
              <p data-l10n-id="shareSecondary">or just copy and paste this link...</p>
              <fieldset className="share-url-wrapper">
                <div className="share-url">
                  <input type="text" readOnly value={this.shareUrl('copy', false)} />
                  <button data-l10n-id="shareCopy" onClick={this.handleClick('copy')} data-clipboard-target=".share-url input">Copy</button>
                </div>
              </fieldset>
            </div>
          </div>
          <div className="copter-wrapper">
            <div className="copter fade-in-fly-up"></div>
          </div>
        </div>
      </View>
    );
  }

  shareUrl(medium, urlencode) {
    const url = `https://testpilot.firefox.com/?utm_source=${medium}&utm_medium=social&utm_campaign=share-page`;
    return urlencode ? encodeURIComponent(url) : url;
  }

  handleClick(label) {
    return () => this.props.sendToGA('event', {
      eventCategory: 'ShareView Interactions',
      eventAction: 'button click',
      eventLabel: label
    });
  }
}

SharePage.propTypes = {
  hasAddon: React.PropTypes.bool,
  uninstallAddon: React.PropTypes.func,
  sendToGA: React.PropTypes.func,
  openWindow: React.PropTypes.func
};
