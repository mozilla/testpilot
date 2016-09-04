import { connect } from 'react-redux';
import { push as routerPush } from 'react-router-redux';

import ExperimentsListPage from '../components/ExperimentsListPage';

import { getInstalled, isExperimentEnabled } from '../reducers/addon';
import { getExperiments } from '../reducers/experiments';

export default connect(
  state => ({
    experiments: getExperiments(state.experiments),
    isFirefox: state.browser.isFirefox,
    hasAddon: state.addon.hasAddon,
    installed: getInstalled(state.addon.installed),
    isExperimentEnabled: experiment =>
      isExperimentEnabled(state.addon, experiment)
  }),
  dispatch => ({
    navigateTo: path => dispatch(routerPush(path))
  })
)(ExperimentsListPage);
