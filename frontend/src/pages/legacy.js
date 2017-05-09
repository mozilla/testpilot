
import React from 'react';

import inject from '../app/lib/inject'
import LegacyPage from '../app/containers/LegacyPage';

export default function create() {
  return inject('legacy', <LegacyPage />);
}
