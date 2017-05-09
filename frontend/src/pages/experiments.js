
import React from 'react';

import inject from '../app/lib/inject'
import HomePageWithAddon from '../app/containers/HomePageWithAddon';

// Since google has an index of /experiments/ from when
// the site was django, show something useful at this url.

export default function create() {
  return inject('experiments', <HomePageWithAddon />);
}
