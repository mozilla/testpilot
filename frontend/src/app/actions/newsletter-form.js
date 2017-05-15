

export const basketUrl = 'https://basket.mozilla.org/news/subscribe/';
export const sourceUrl = 'https://testpilot.firefox.com/';

function makeSimpleActionCreator(type) {
  return (payload) => ({ type, payload });
}

const actions = {
  newsletterFormSetEmail: makeSimpleActionCreator('NEWSLETTER_FORM_SET_EMAIL'),
  newsletterFormSetPrivacy: makeSimpleActionCreator('NEWSLETTER_FORM_SET_PRIVACY'),
  newsletterFormSetFailed: makeSimpleActionCreator('NEWSLETTER_FORM_SET_FAILED'),
  newsletterFormSetSubmitting: makeSimpleActionCreator('NEWSLETTER_FORM_SET_SUBMITTING'),
  newsletterFormSetSucceeded: makeSimpleActionCreator('NEWSLETTER_FORM_SET_SUCCEEDED')
};

function newsletterFormSubscribe(dispatch, email, locale) {
  dispatch(actions.newsletterFormSetSubmitting());
  fetch(basketUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `newsletters=test-pilot&email=${encodeURIComponent(email)}&lang=${encodeURIComponent(locale)}&source_url=${encodeURIComponent(sourceUrl)}`
  })
    .then(response => {
      if (response.ok) {
        dispatch(actions.newsletterFormSetSucceeded());
      } else {
        dispatch(actions.newsletterFormSetFailed());
      }
    })
    .catch(() => dispatch(actions.newsletterFormSetFailed()));
  return {
    type: 'NEWSLETTER_FORM_SUBSCRIBE'
  };
}

export default Object.assign({}, actions, {
  newsletterFormSubscribe
});
