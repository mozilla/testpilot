import BaseView from './base-view';

export default BaseView.extend({

  _template: `
    <div class="modal-container">
      <div id="{{id}}-modal" class="modal feedback-modal modal-bounce-in">
        <header>
          <h3 class="title warning" data-l10n-id="retireDialogTitle">Uninstall Test Pilot?</h3>
        </header>
        <form>

          <div class="modal-content modal-form">
            <p data-l10n-id="retireMessage" class="centered">As you wish. This will disable any active tests, uninstall the Test Pilot add-on, and remove your account information from our servers.</p>
          </div>
          <div class="modal-actions">
            <button data-hook="submit-feedback" data-l10n-id="retireSubmitButton" class="submit button warning large">Proceed</button>
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
