
import React from 'react';

import inject from '../app/lib/inject';
import SharePage from '../app/containers/SharePage';

export default function create() {
  return inject('share', <SharePage />);
}
