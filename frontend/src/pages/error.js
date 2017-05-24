
import React from 'react';

import inject from '../app/lib/inject';
import ErrorPage from '../app/containers/ErrorPage';

export default function create() {
  return inject('error', <ErrorPage />);
}
