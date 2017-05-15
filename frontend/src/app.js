
import 'babel-polyfill/browser';
import es6Promise from 'es6-promise';
import 'isomorphic-fetch';
import 'l20n';
import Raven from 'raven-js';

import './app/lib/ga-snippet';
import config from './app/config';

import error from './pages/error.js';
import experiment from './pages/experiment.js';
import experiments from './pages/experiments.js';
import home from './pages/home.js';
import legacy from './pages/legacy.js';
import onboarding from './pages/onboarding.js';
import retire from './pages/retire.js';
import share from './pages/share.js';

es6Promise.polyfill();
Raven.config(config.ravenPublicDSN).install();

const routes = {
  error,
  experiment,
  experiments,
  home,
  legacy,
  onboarding,
  retire,
  share
};

let path = window.location.pathname;
if (path.endsWith('/')) {
  path = path.slice(0, path.length - 1);
}
let spl = path.split('/');
if (path === '') {
  spl = ['', 'home'];
}
if (spl[1] === 'experiments' && spl.length === 3) {
  experiment(spl[2]);
} else if (spl.length === 2) {
  routes[spl[1]]();
} else {
  routes.error();
}
