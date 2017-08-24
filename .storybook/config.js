/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */
import 'l20n';

import { configure } from '@storybook/react';

import '../frontend/build/static/styles/experiments.css';
import '../frontend/build/static/styles/main.css';

const req = require.context('../frontend/stories', true, /\-story\.jsx?$/);

function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
