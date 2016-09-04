import { connect } from 'react-redux';
import { push as routerPush } from 'react-router-redux';

import RetirePage from '../components/RetirePage';

export default connect(
  state => ({
    hasAddon: state.addon.hasAddon
  }),
  dispatch => ({
    navigateTo: path => dispatch(routerPush(path))
  })
)(RetirePage);
