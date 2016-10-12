import React from 'react';

import View from '../components/View';


export default class OnboardingPage extends React.Component {
  render() {
    return (
      <View spaceBetween={true} {...this.props}>
        <div className="centered-banner">
          <div id="onboarding" className="modal">
            <div className="modal-content centered">
              <div className="toolbar-button-onboarding"></div>
              <p data-l10n-id="onboardingMessage">We put an icon in your toolbar so you can always find Test Pilot.</p>
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
