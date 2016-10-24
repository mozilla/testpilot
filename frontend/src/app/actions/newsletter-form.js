import { createActions } from 'redux-actions';
import 'isomorphic-fetch';

export const basketUrl = 'https://basket.mozilla.org/news/subscribe/';

const actions = createActions(
  {
    newsletterFormSetEmail: email => email,
    newsletterFormSetPrivacy: privacy => privacy
  },
  'newsletterFormSetFailed',
  'newsletterFormSetSubmitting',
  'newsletterFormSetSucceeded'
);

const subscribeActions = createActions({
  newsletterFormSubscribe: (dispatch, email) => {
    dispatch(actions.newsletterFormSetSubmitting());
    fetch(basketUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `newsletters=test-pilot&email=${encodeURIComponent(email)}`
    })
      .then(response => {
        if (response.ok) {
          dispatch(actions.newsletterFormSetSucceeded());
        } else {
          dispatch(actions.newsletterFormSetFailed());
        }
      })
      .catch(() => dispatch(actions.newsletterFormSetFailed()));
  }
});

export default Object.assign({}, actions, subscribeActions);
