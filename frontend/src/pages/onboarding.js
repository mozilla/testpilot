
import React from 'react';

import inject from '../app/lib/inject';
import OnboardingPage from '../app/containers/OnboardingPage';

export default function create() {
  return inject('onboarding', <OnboardingPage />);
}
