import { handleActions } from 'redux-actions';


const newsletterFormSetEmail = (state, { payload: email }) => ({
  ...state,
  email
});

const newsletterFormSetPrivacy = (state, { payload: privacy }) => ({
  ...state,
  privacy
});

const newsletterFormSetSubmitting = state => ({
  ...state,
  failed: false,
  submitting: true,
  succeeded: false
});

const newsletterFormSetFailed = state => ({
  ...state,
  failed: true,
  submitting: false,
  succeeded: false
});

const newsletterFormSetSucceeded = state => ({
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
