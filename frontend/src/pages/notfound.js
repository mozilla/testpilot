import React from 'react';

import inject from '../app/lib/inject'
import NotFoundPage from '../app/containers/NotFoundPage';

export default function create() {
  return inject('notfound', <NotFoundPage />);
}
