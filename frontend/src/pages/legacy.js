
import React from 'react';

import inject from '../app/lib/inject';
import HomePage from '../app/containers/HomePage';

export default function create() {
  return inject('home', <HomePage />);
}
