
import React from 'react';

import inject from '../app/lib/inject';
import RetirePage from '../app/containers/RetirePage';

export default function create() {
  return inject('retire', <RetirePage />);
}
