import app from 'ampersand-app';
import BaseView from './base-view';

export default BaseView.extend({

  _template: `
    <div class="modal-container">
      <div class="modal onboarding-modal modal-bounce-in">
        <header>
          <h3 class="title onboarding" data-l10n-id="tourOnboardingTitle">{{model.title}} enabled!</h3>
        </header>
        <div class="modal-content">
          <div class="copter-wrapper">
            <div class="copter"></div>
          </div>
        </div>
        <div class="modal-actions">
          <button data-hook="start-tour" class="button default large" data-l10n-id="tourStartButton">Take the Tour</button><a data-hook="cancel-modal" class="modal-escape" data-l10n-id="tourCancelButton">Skip</a>
        </div>
      </div>
      <div class="modal tour-modal no-display">
        {{#model.tour_steps}}
          <div class="tour-content no-display">
            <div class="tour-image"><img src="{{image}}"></div>
            {{#copy}}
              <div class="tour-text">{{{copy}}}</div>
            {{/copy}}
          </div>
        {{/model.tour_steps}}
        <div class="tour-actions">
          <div class="tour-back"></div>
          <div class="tour-next"></div>
          <button data-hook="cancel-modal-done" class="button default large no-display" data-l10n-id="tourDoneButton">Done</button>
        </div>
      </div>
    </div>
  `,

  props: {
    'currentStep': { type: 'number', default: -1 }
  },

  bindings: {
    'currentStep': {
      type: function updateStep(el, value) {
        const atIntro = (value === -1);
        const atStart = (value === 0);
        const atEnd = (value === this.model.tour_steps.length - 1);

        this.query('.onboarding-modal')
          .classList[atIntro ? 'remove' : 'add']('no-display');

        this.query('.tour-modal')
          .classList[atIntro ? 'add' : 'remove']('no-display');

        this.query('.tour-back')
          .classList[atStart ? 'add' : 'remove']('hidden');

        this.query('.tour-back')
          .classList[atEnd ? 'add' : 'remove']('no-display');

        this.query('.tour-next')
          .classList[atEnd ? 'add' : 'remove']('no-display');

        this.query('[data-hook=cancel-modal-done]')
          .classList[atEnd ? 'remove' : 'add']('no-display');

        this.queryAll('.tour-content').forEach((stepEl, idx) => {
          stepEl.classList[(value === idx) ? 'remove' : 'add']('no-display');
        });
      }
    }
  },

  events: {
    'click button[data-hook=start-tour]': 'takeTour',
    'click [data-hook=cancel-modal]': 'cancel',
    'click [data-hook=cancel-modal-done]': 'complete',
    'click .tour-back': 'tourBack',
    'click .tour-next': 'tourNext'
  },

  cancel() {
    this.animateRemove();

    app.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'cancel tour'
    });
  },

  complete() {
    this.animateRemove();

    app.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'complete tour'
    });
  },

  takeTour() {
    this.currentStep = 0;

    app.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'take tour'
    });
  },

  tourBack() {
    this.currentStep = Math.max(this.currentStep - 1, 0);
    app.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: `back to step ${this.currentStep}`
    });
  },

  tourNext() {
    this.currentStep = Math.min(this.currentStep + 1,
                                this.model.tour_steps.length - 1);
    app.sendToGA('event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: `forward to step ${this.currentStep}`
    });
  }

});
