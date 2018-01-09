// @flow

type NewsletterFormState = {
  email: string,
  privacy: boolean,
  submitting: boolean,
  failed: boolean,
  succeeded: boolean
};

export function defaultState(): NewsletterFormState {
  return {
    email: "",
    privacy: false,
    submitting: false,
    failed: false,
    succeeded: false
  };
}

type SetEmailAction = {
  type: 'NEWSLETTER_FORM_SET_EMAIL',
  payload: string
};

type SetPrivacyAction = {
  type: 'NEWSLETTER_FORM_SET_PRIVACY',
  payload: boolean
};

type NewsletterFormActions = SetEmailAction | SetPrivacyAction;

export function newsletterFormSetEmail(
  state: NewsletterFormState,
  { payload: email }: SetEmailAction
): NewsletterFormState {
  return {
    ...state,
    email
  };
}

export function newsletterFormSetPrivacy(
  state: NewsletterFormState,
  { payload: privacy }: SetPrivacyAction
): NewsletterFormState {
  return {
    ...state,
    privacy
  };
}

export function newsletterFormSetSubmitting(
  state: NewsletterFormState
): NewsletterFormState {
  return {
    ...state,
    failed: false,
    submitting: true,
    succeeded: false
  };
}

export function newsletterFormSetFailed(
  state: NewsletterFormState
): NewsletterFormState {
  return {
    ...state,
    failed: true,
    submitting: false,
    succeeded: false
  };
}

export function newsletterFormSetSucceeded(
  state: NewsletterFormState
): NewsletterFormState {
  return {
    ...state,
    failed: false,
    submitting: false,
    succeeded: true
  };
}

export default function newsletterFormReducer(
  state: NewsletterFormState,
  action: NewsletterFormActions
): NewsletterFormState {
  if (state === undefined) {
    return defaultState();
  }
  switch (action.type) {
    case "NEWSLETTER_FORM_SET_EMAIL":
      return newsletterFormSetEmail(state, action);
    case "NEWSLETTER_FORM_SET_PRIVACY":
      return newsletterFormSetPrivacy(state, action);
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
