import { subscribeToBasket } from "../lib/utils";

function makeSimpleActionCreator(type) {
  return (payload) => ({ type, payload });
}

const actions = {
  newsletterFormSetEmail: makeSimpleActionCreator("NEWSLETTER_FORM_SET_EMAIL"),
  newsletterFormSetPrivacy: makeSimpleActionCreator("NEWSLETTER_FORM_SET_PRIVACY"),
  newsletterFormSetFailed: makeSimpleActionCreator("NEWSLETTER_FORM_SET_FAILED"),
  newsletterFormSetSubmitting: makeSimpleActionCreator("NEWSLETTER_FORM_SET_SUBMITTING"),
  newsletterFormSetSucceeded: makeSimpleActionCreator("NEWSLETTER_FORM_SET_SUCCEEDED")
};

function newsletterFormSubscribe(dispatch, email, source) {
  dispatch(actions.newsletterFormSetSubmitting());
  subscribeToBasket(email, source)
    .then(response => {
      if (response.ok) {
        dispatch(actions.newsletterFormSetSucceeded());
      } else {
        dispatch(actions.newsletterFormSetFailed());
      }
    })
    .catch(() => dispatch(actions.newsletterFormSetFailed()));
  return {
    type: "NEWSLETTER_FORM_SUBSCRIBE"
  };
}

export default Object.assign({}, actions, {
  newsletterFormSubscribe
});
