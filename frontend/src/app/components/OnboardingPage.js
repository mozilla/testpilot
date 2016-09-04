import React from 'react';

import Header from './Header';
import Footer from './Footer';

export default function OnboardingPage() {
  return (
    <div className="full-page-wrapper space-between">
      <Header />
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
      <footer id="main-footer" className="content-wrapper">
        <Footer />
      </footer>
    </div>
  );
}
