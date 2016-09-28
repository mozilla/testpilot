import { connect } from 'react-redux';
import { push as routerPush } from 'react-router-redux';

import LandingPage from '../components/LandingPage';

import { isExperimentEnabled } from '../reducers/addon';
import experimentSelector from '../selectors/experiment';

export default connect(
  state => ({
    experiments: experimentSelector(state),
    isFirefox: state.browser.isFirefox,
    isMinFirefox: state.browser.isMinFirefox,
    hasAddon: state.addon.hasAddon,
    isExperimentEnabled: experiment =>
      isExperimentEnabled(state.addon, experiment)
  }),
  dispatch => ({
    navigateTo: path => dispatch(routerPush(path))
  })
)(LandingPage);
