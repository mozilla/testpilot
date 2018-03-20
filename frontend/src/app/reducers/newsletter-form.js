// @flow

type NewsletterFormState = {
  submitting: boolean,
  failed: boolean,
  succeeded: boolean
};

export function defaultState(): NewsletterFormState {
  return {
    submitting: false,
    failed: false,
    succeeded: false
  };
}

export function newsletterFormSetSubmitting(
  state: NewsletterFormState
): NewsletterFormState {
  return {
    failed: false,
    submitting: true,
    succeeded: false
  };
}

export function newsletterFormSetFailed(
  state: NewsletterFormState
): NewsletterFormState {
  return {
    failed: true,
    submitting: false,
    succeeded: false
  };
}

export function newsletterFormSetSucceeded(
  state: NewsletterFormState
): NewsletterFormState {
  return {
    failed: false,
    submitting: false,
    succeeded: true
  };
}

export default function newsletterFormReducer(
  state: NewsletterFormState,
  action: {type: String}
): NewsletterFormState {
  if (state === undefined) {
    return defaultState();
  }
  switch (action.type) {
    case "NEWSLETTER_FORM_SET_SUBMITTING":
      return newsletterFormSetSubmitting(state);
    case "NEWSLETTER_FORM_SET_FAILED":
      return newsletterFormSetFailed(state);
    case "NEWSLETTER_FORM_SET_SUCCEEDED":
      return newsletterFormSetSucceeded(state);
    default:
      return state;
  }
}
