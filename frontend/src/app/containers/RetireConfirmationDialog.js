import { connect } from 'react-redux';
import { push as routerPush } from 'react-router-redux';

import RetireConfirmationDialog from '../components/RetireConfirmationDialog';

export default connect(
  state => ({
    hasAddon: state.addon.hasAddon
  }),
  dispatch => ({
    navigateTo: path => dispatch(routerPush(path))
  })
)(RetireConfirmationDialog);
