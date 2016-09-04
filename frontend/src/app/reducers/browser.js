import { handleActions } from 'redux-actions';

const setIsFirefox = (state, { payload: isFirefox }) => ({ ...state, isFirefox });

export default handleActions({
  setIsFirefox
}, {
  isFirefox: false
});
