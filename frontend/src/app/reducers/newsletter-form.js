import { handleActions } from 'redux-actions';


export const newsletterFormSetEmail = (state, { payload: email }) => ({
  ...state,
  email
});

export const newsletterFormSetPrivacy = (state, { payload: privacy }) => ({
  ...state,
  privacy
});

export const newsletterFormSetSubmitting = state => ({
  ...state,
  failed: false,
  submitting: true,
  succeeded: false
});

export const newsletterFormSetFailed = state => ({
  ...state,
  failed: true,
  submitting: false,
  succeeded: false
});

export const newsletterFormSetSucceeded = state => ({
  ...state,
  failed: false,
  submitting: false,
  succeeded: true
});

export const initialState = {
  email: '',
  privacy: false,
  submitting: false,
  failed: false,
  succeeded: false
};

export default handleActions({
  newsletterFormSetEmail,
  newsletterFormSetPrivacy,
  newsletterFormSetSubmitting,
  newsletterFormSetFailed,
  newsletterFormSetSucceeded
}, initialState);
