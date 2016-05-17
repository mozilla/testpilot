import app from 'ampersand-app';
import BaseView from './base-view';

export default BaseView.extend({

  _template: `
    <div class="modal-container">
      <div id="{{id}}-modal" class="modal feedback-modal modal-bounce-in">
        <h3 class="title" data-l10n-id="{{title}}"></h3>
        <div class="modal-content">
          <div class="copter-wrapper">
            <div class="copter"></div>
          </div>
          <p class="centered" data-l10n-id="feedbackUninstallCopy">
            Your participation in Firefox Test Pilot means a lot!
            Please check out our other experiments, and stay tuned for more to come!
          </p>
        </div>
        <div class="modal-actions">
          <a data-l10n-id="feedbackSubmitButton" data-hook="submit-feedback" href="{{surveyUrl}}" target="_blank" class="submit button default large quit">Take a quick survey</a>
          <a data-l10n-id="feedbackCancelButton" class="cancel" href="">Close</a>
        </div>
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
    'surveyUrl': 'string'
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

  submit() {
    this.animateRemove();
    app.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'exit survey disabled'
    });
    if (this.parentOnSubmit) this.parentOnSubmit();
  }
});
