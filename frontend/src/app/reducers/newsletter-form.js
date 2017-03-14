

export function newsletterFormSetEmail(state, { payload: email }) {
  return {
    ...state,
    email
  };
}

export function newsletterFormSetPrivacy(state, { payload: privacy }) {
  return {
    ...state,
    privacy
  };
}

export function newsletterFormSetSubmitting(state) {
  return {
    ...state,
    failed: false,
    submitting: true,
    succeeded: false
  };
}

export function newsletterFormSetFailed(state) {
  return {
    ...state,
    failed: true,
    submitting: false,
    succeeded: false
  };
}

export function newsletterFormSetSucceeded(state) {
  return {
    ...state,
    failed: false,
    submitting: false,
    succeeded: true
  };
}

export const initialState = {
  email: '',
  privacy: false,
  submitting: false,
  failed: false,
  succeeded: false
};

export default function newsletterFormReducer(state, action) {
  if (state === undefined) {
    return initialState;
  }
  switch (action.type) {
    case 'NEWSLETTER_FORM_SET_EMAIL':
      return newsletterFormSetEmail(state, action);
    case 'NEWSLETTER_FORM_SET_PRIVACY':
      return newsletterFormSetPrivacy(state, action);
    case 'NEWSLETTER_FORM_SET_SUBMITTING':
      return newsletterFormSetSubmitting(state, action);
    case 'NEWSLETTER_FORM_SET_FAILED':
      return newsletterFormSetFailed(state, action);
    case 'NEWSLETTER_FORM_SET_SUCCEEDED':
      return newsletterFormSetSucceeded(state, action);
    default:
      return state;
  }
}
