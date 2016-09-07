import BaseView from './base-view';

export default BaseView.extend({

  _template: `
    <div class="modal-container">
      <div id="{{id}}-modal" class="modal feedback-modal modal-bounce-in">
        <header>
          <h3 class="title" data-l10n-id="discussNotifyTitle">Just one second...</h3>
        </header>
        <form>

          <div class="modal-content modal-form">
            <div data-l10n-id="discussNotifyMessageAccountless" class="centered">
              <p>In the spirit of experimentation, we are using an external forum service. You will need to create an account if you wish to participate on the forums.</p>
              <p>If you don't feel like creating another account, you can
                 always leave feedback through Test Pilot.
              <br>
                 (We really do read this stuff)
              </p>
            </div>
          </div>
          <div class="modal-actions">
            <button data-hook="submit-feedback" data-l10n-id="discussNotifySubmitButton" class="submit button large default">Take me to the forum</button>
            <a data-l10n-id="discussNotifyCancelButton" class="cancel modal-escape" href="">Cancel</a>
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
