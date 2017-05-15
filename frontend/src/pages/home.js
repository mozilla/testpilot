
import React from 'react';

import inject from '../app/lib/inject'
import HomePageNoAddon from '../app/containers/HomePageNoAddon';

export default function create() {
  return inject('home', <HomePageNoAddon />);
}
