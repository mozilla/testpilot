import app from 'ampersand-app';
import BaseView from './base-view';

export default BaseView.extend({

  _template: `
    <div id="modal-screen" class="dark">
      <div id="{{id}}-modal" class="feedback-modal">
        <h3 class="title" data-l10n-id="{{title}}"></h3>
        <section class="main">
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
          <section class="extra">
            <p data-l10n-id="feedbackExtraCaption">Do you have any additional feedback?</p>
            <textarea data-l10n-id="feedbackExtraTextarea"
              placeholder="what's on your mind..."></textarea>
          </section>
          <section class="controls">
            <button data-l10n-id="feedbackSubmitButton" class="submit button primary">Submit Feedback</button>
            <a data-l10n-id="feedbackCancelButton" class="cancel" href="">Cancel</a>
          </section>
        </section>
      </div>
    </div>
  `,

  initialize(opts) {
    this.parentOnSubmit = opts.onSubmit;
  },

  props: {
    'id': 'string',
    'title': 'string',
    'questions': 'object',
    'experiment': 'string',
    'apiUrl': { type: 'string', default: '/api/feedback' }
  },

  events: {
    'click .submit': 'submit',
    'click .cancel': 'cancel'
  },

  cancel(e) {
    this.animateRemove();
    e.preventDefault();
    e.stopPropagation();
  },

  submit(e) {
    // Hide the feedback form right away & let the submission happen in the
    // background - user probably doesn't care about progress or confirmation
    this.animateRemove();
    if (this.parentOnSubmit) {
      this.parentOnSubmit();
    }
    e.preventDefault();
    e.stopPropagation();

    const checked = this.el.querySelector('input:checked');
    const value = checked ? checked.getAttribute('value') : '';
    const extra = this.el.querySelector('section.extra textarea').value;

    if (!value && !extra) {
      // TODO: Could message some form validation here, but instead just skip
      // submission for now unless actual feedback is supplied.
      return;
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
  }

});
