
import React from 'react';

import inject from '../app/lib/inject'
import ExperimentPage from '../app/containers/ExperimentPage';
import { setSlug } from '../app/actions/experiments'

export default function create(slug) {
  return inject(
    'experiment',
    <ExperimentPage />,
    s => s.dispatch(setSlug(slug))
  );
}
