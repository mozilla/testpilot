import React from 'react';

import View from '../components/View';


export default class Restart extends React.Component {
  componentWillMount() {
    this.props.sendToGA('event', {
      eventCategory: 'PostInstall Interactions',
      eventAction: 'view modal',
      eventLabel: 'restart required'
    });
  }

  render() {
    return (
      <View spaceBetween={true} {...this.props}>
        <div className="split-banner restart-message responsive-content-wrapper">
          <div className="restart-image">
            <img src="/static/images/restart-graphic@2x.jpg" width="208" height="273"/>
          </div>
          <div className="intro-text">
            <span data-l10n-id="restartIntroLead" className="block lead-in">Preflight checklist</span>
            <ol className="banner">
              <li data-l10n-id="restartIntroOne">Restart your browser</li>
              <li data-l10n-id="restartIntroTwo">Locate the Test Pilot add-on</li>
              <li data-l10n-id="restartIntroThree">Select your experiments</li>
            </ol>
          </div>
        </div>
      </View>
    );
  }
}

Restart.propTypes = {
  experimentTitle: React.PropTypes.string,
  hasAddon: React.PropTypes.bool,
  uninstallAddon: React.PropTypes.func,
  sendToGA: React.PropTypes.func,
  openWindow: React.PropTypes.func
};
