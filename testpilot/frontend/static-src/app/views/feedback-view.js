import app from 'ampersand-app';
import BaseView from './base-view';

export default BaseView.extend({

  _template: `
    <div class="modal-container">
      <div id="{{id}}-modal" class="modal feedback-modal modal-bounce-in">
        <h3 class="title" data-l10n-id="{{title}}"></h3>
        <form>
          <div class="modal-content modal-form">
            <span data-l10n-id="feedbackErrorMessage" class="form-notification" data-hook="form-notification">Please choose an option.</span>
            <ul class="questions">
              {{#questions}}
              <li>
                <input type="radio"
                  name="{{id}}-question"
                  id="{{id}}-question-{{value}}"
                  value="{{value}}">
                <label data-hook="title"
                  for="{{id}}-question-{{value}}"
                  data-l10n-id="{{title}}"></label>
              </li>
              {{/questions}}
            </ul>
            <div class="additional-feedback">
              <p data-l10n-id="feedbackExtraCaption" class="text-area-label">Do you have any additional feedback? (optional)</p>
              <textarea data-l10n-id="feedbackExtraTextarea"
                placeholder="what's on your mind..."></textarea>
            </div>
          </div>
          <div class="modal-actions">
            <button data-hook="submit-feedback" data-l10n-id="feedbackSubmitButton" class="submit button default large">Submit Feedback</button>
            <a data-l10n-id="feedbackCancelButton" class="cancel" href="">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  `,

  initialize(opts) {
    this.parentOnSubmit = opts.onSubmit;
    this.isValid = false;
    this.showFormValidation = false;
  },

  props: {
    'id': 'string',
    'title': 'string',
    'questions': 'object',
    'experiment': 'string',
    'apiUrl': { type: 'string', default: '/api/feedback' },
    'isValid': {
      type: 'boolean',
      default: 'false'
    },
    'showFormValidation': {
      type: 'boolean',
      default: 'false'
    }
  },

  events: {
    'click .submit': 'submit',
    'click .cancel': 'cancel',
    'change form': 'validate'
  },

  bindings: {
    'isValid': {
      type: 'booleanClass',
      hook: 'submit-feedback',
      name: 'disabled',
      invert: true
    },
    'showFormValidation': {
      type: 'booleanClass',
      hook: 'form-notification',
      name: 'hidden',
      invert: true
    }
  },

  cancel(e) {
    this.animateRemove();
    e.preventDefault();
    e.stopPropagation();
  },

  validate() {
    this.isValid = !!(this.query('input:checked'));
    if (this.isValid && this.showFormValidation) {
      this.showFormValidation = false;
    }
  },

  submit(e) {
    const checked = this.query('input:checked');
    const value = checked ? checked.getAttribute('value') : '';
    const extra = this.query('.additional-feedback textarea').value;

    if (this.isValid) {
      this.animateRemove();

      if (this.parentOnSubmit) {
        this.parentOnSubmit();
      }

      fetch(this.apiUrl, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFTOKEN': app.me.csrfToken
        },
        body: JSON.stringify({
          experiment: this.experiment,
          question: this.title,
          answer: value || 'other',
          extra: extra
        })
      });
    } else {
      this.showFormValidation = true;
    }

    e.preventDefault();
    e.stopPropagation();
  }
});
