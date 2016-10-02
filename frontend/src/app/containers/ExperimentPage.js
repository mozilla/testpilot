import { connect } from 'react-redux';
import { push as routerPush } from 'react-router-redux';

import ExperimentPage from '../components/ExperimentPage';

import { enableExperiment, disableExperiment } from '../lib/addon';
import { getInstalled, isExperimentEnabled } from '../reducers/addon';
import { getExperimentBySlug } from '../reducers/experiments';
import experimentSelector from '../selectors/experiment';

export default connect(
  state => ({
    experiments: experimentSelector(state),
    isFirefox: state.browser.isFirefox,
    isMinFirefox: state.browser.isMinFirefox,
    isDev: state.browser.isDev,
    hasAddon: state.addon.hasAddon,
    installed: getInstalled(state.addon),
    getExperimentBySlug: slug =>
      getExperimentBySlug(state.experiments, slug),
    installedAddons: state.addon.installedAddons,
    isExperimentEnabled: experiment =>
      isExperimentEnabled(state.addon, experiment)
  }),
  dispatch => ({
    navigateTo: path => dispatch(routerPush(path)),
    enableExperiment: experiment => enableExperiment(dispatch, experiment),
    disableExperiment: experiment => disableExperiment(dispatch, experiment)
  })
)(ExperimentPage);
