import { createActions } from 'redux-actions';

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
    const url = 'https://basket.mozilla.org/news/subscribe/';
    dispatch(actions.newsletterFormSetSubmitting());
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `newsletters=test-pilot&email=${encodeURIComponent(email)}`
    })
      .then(() => dispatch(actions.newsletterFormSetSucceeded()))
      .catch(() => dispatch(actions.newsletterFormSetFailed()));
  }
});

export default Object.assign({}, actions, subscribeActions);
