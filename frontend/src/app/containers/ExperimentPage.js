import { connect } from 'react-redux';
import { push as routerPush } from 'react-router-redux';

import ExperimentPage from '../components/ExperimentPage';

import { getInstalled, isExperimentEnabled } from '../reducers/addon';
import { getExperiments, getExperimentBySlug } from '../reducers/experiments';
import { enableExperiment, disableExperiment } from '../lib/addon';

export default connect(
  state => ({
    experiments: getExperiments(state.experiments),
    isFirefox: state.browser.isFirefox,
    isMinFirefox: state.browser.isMinFirefox,
    isDev: state.browser.isDev,
    hasAddon: state.addon.hasAddon,
    installed: getInstalled(state.addon),
    getExperimentBySlug: slug =>
      getExperimentBySlug(state.experiments, slug),
    isExperimentEnabled: experiment =>
      isExperimentEnabled(state.addon, experiment)
  }),
  dispatch => ({
    navigateTo: path => dispatch(routerPush(path)),
    enableExperiment: experiment => enableExperiment(dispatch, experiment),
    disableExperiment: experiment => disableExperiment(dispatch, experiment)
  })
)(ExperimentPage);
