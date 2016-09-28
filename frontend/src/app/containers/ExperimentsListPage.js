import { connect } from 'react-redux';
import { push as routerPush } from 'react-router-redux';

import ExperimentsListPage from '../components/ExperimentsListPage';

import { getInstalled, isExperimentEnabled } from '../reducers/addon';
import experimentSelector from '../selectors/experiment';


export default connect(
  state => ({
    experiments: experimentSelector(state),
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
