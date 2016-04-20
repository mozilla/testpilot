import BaseView from './base-view';

export default BaseView.extend({

  _template: `
    <div class="modal-container">
      <div id="{{id}}-modal" class="modal feedback-modal modal-bounce-in">
        <header>
          <h3 class="title warning" data-l10n-id="retireDialogTitle">Retire from Test Pilot?</h3>
        </header>
        <form>

          <div class="modal-content modal-form">
            <p data-l10n-id="retireMessage" class="centered">If you retire from Test Pilot, we will disable any active tests, uninstall the Test Pilot add-on, remove your account information from our servers, and generally just leave you alone.</p>
          </div>
          <div class="modal-actions">
            <button data-hook="submit-feedback" data-l10n-id="retireSubmitButton" class="submit button warning large">Retire</button>
            <a data-l10n-id="retireCancelButton" class="cancel modal-escape" href="">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  `,

  initialize(opts) {
    this.parentOnSubmit = opts.onSubmit;
  },

  props: {
    'id': 'string'
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
    this.animateRemove();
    if (this.parentOnSubmit) {
      this.parentOnSubmit();
    }
    e.preventDefault();
    e.stopPropagation();
  }

});
