import app from 'ampersand-app';
import BaseView from './base-view';
import emailValidator from 'micro-email-validator';

export default BaseView.extend({
  _template: `
  <div class="modal-container">
    <div data-hook="first-page" class="modal feedback-modal modal-bounce-in">
      <header>
        <h3 class="title" data-l10n-id="emailOptInDialogTitle">Welcome to Test Pilot!</h3>
      </header>
      <form>
        <div class="modal-content modal-form centered">
          <p data-l10n-id="emailOptInMessage" class="">Find out about new experiments and see test results for experiments you've tried.</p>
          <p class="error" data-hook="invalid-email" data-l10n-id="emailValidationError" >Please use a valid email address!</p>
          <input data-hook="email" data-l10n-id="emailOptInInput" placeholder="email goes here :)">
        </div>
        <div class="modal-actions">
          <button data-hook="submit-email" data-l10n-id="emailOptInButton" class="submit button large default">Sign me up</button>
          <a data-hook="cancel-modal" data-l10n-id="emailOptInSkip" class="cancel modal-escape" href="">Skip</a>
        </div>
      </form>
    </div>
    <div data-hook="second-page" class="modal">
      <header>
        <h3 class="title" data-l10n-id="emailOptInConfirmationTitle">Email Sent</h3>
      </header>
      <div class="modal-content centered">
        <div class="envelope"></div>
        <p data-l10n-id="emailOptInSuccessMessage">When you get a chance, head over to your inbox to verify your email address. Thank you!</p>
        <button class="button default" data-hook="continue" data-l10n-id="emailOptInConfirmationClose">On to the experiments...</button>
      </div>
    </div>
  </div>
  `,

  session: {
    isFirstPage: { type: 'boolean', default: true },
    isValidEmail: { type: 'boolean', default: true }
  },

  bindings: {
    'isFirstPage': [
      {
        type: 'toggle',
        hook: 'first-page'
      },
      {
        type: 'toggle',
        hook: 'second-page',
        invert: true
      }
    ],
    'isValidEmail': {
      type: 'toggle',
      hook: 'invalid-email',
      invert: true
    }
  },

  events: {
    'click button[data-hook=submit-email]': 'submit',
    'click [data-hook=cancel-modal]': 'skip',
    'click [data-hook=continue]': 'continue'
  },

  submit(e) {
    e.preventDefault();

    // TODO: should we log the number of email validity failures? worth tracking?
    const email = this.query('input[data-hook=email]').value;
    if (!this.validate(email)) {
      this.set('isValidEmail', false);
      return;
    }
    // Hide the email validation error message, if it's visible.
    this.set('isValidEmail', true);

    app.sendToGA('event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'button click',
      eventLabel: 'Sign me up'
    });

    app.subscribeToBasket(email, () => {
      // TODO: review question: basket failures are swallowed by the subscribeToBasket
      // function. Is it worth it to send a second GA ping to help us monitor the error
      // rate? If so, should I overload the button click interaction, as done below, or
      // use some other kind of category / action?
      app.sendToGA('event', {
        eventCategory: 'HomePage Interactions',
        eventAction: 'button click',
        eventLabel: 'email submitted to basket'
      });
    });

    this.set('isFirstPage', false);
  },

  skip(e) {
    e.preventDefault();
    e.stopPropagation();

    app.sendToGA('event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'button click',
      // review TODO: The label says 'skip'. Should I just use that? Want to make
      // the events readable and specific on the GA side.
      eventLabel: 'Skip email'
    });

    this._close();
  },

  continue(e) {
    e.preventDefault();

    app.sendToGA('event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'button click',
      eventLabel: 'On to the experiments'
    });

    this._close();
  },

  validate(email) {
    return emailValidator(email);
  },

  _close() {
    this.animateRemove();
  }
});
