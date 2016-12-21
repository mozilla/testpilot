import React from 'react';
import emailValidator from 'micro-email-validator';

export default class EmailDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isFirstPage: true,
      isValidEmail: true,
      email: ''
    };
  }

  render() {
    const { isFirstPage, isValidEmail } = this.state;

    return (
      <div className="modal-container">
        {isFirstPage && <div className="modal feedback-modal modal-bounce-in">
          <header>
            <h3 className="title" data-l10n-id="emailOptInDialogTitle">Welcome to Test Pilot!</h3>
          </header>
          <form>
            <div className="modal-content modal-form centered">
              <p data-l10n-id="emailOptInMessage" className="">Find out about new experiments and see test results for experiments you've tried.</p>
              {!isValidEmail && <p className="error" data-l10n-id="emailValidationError" >Please use a valid email address!</p>}
              <input data-l10n-id="emailOptInInput" placeholder="email goes here :)"
                     onChange={e => this.handleEmailChange(e)}
                     value={this.state.email} />
            </div>
            <div className="modal-actions">
              <button onClick={e => this.submit(e)} data-l10n-id="emailOptInButton" className="submit button large default">Sign me up</button>
              <a onClick={e => this.skip(e)} data-l10n-id="emailOptInSkip" className="cancel modal-escape" href="">Skip</a>
            </div>
          </form>
        </div>}
        {!isFirstPage && <div className="modal">
          <header>
            <h3 className="title" data-l10n-id="emailOptInConfirmationTitle">Email Sent</h3>
          </header>
          <div className="modal-content centered">
            <div className="envelope"></div>
            <p data-l10n-id="emailOptInSuccessMessage2">Thank you!</p>
            <button onClick={e => this.continue(e)} className="button default" data-l10n-id="emailOptInConfirmationClose" data-hook="continue">On to the experiments...</button>
          </div>
        </div>}
      </div>
    );
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  submit(e) {
    const { sendToGA, subscribeToBasket } = this.props;
    e.preventDefault();

    // TODO: should we log the number of email validity failures? worth tracking?
    const email = this.state.email;
    if (!this.validate(email)) {
      this.setState({ isValidEmail: false });
      return;
    }
    // Hide the email validation error message, if it's visible.
    this.setState({ isValidEmail: true });

    sendToGA('event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'button click',
      eventLabel: 'Sign me up'
    });

    subscribeToBasket(email, () => {
      // TODO: review question: basket failures are swallowed by the subscribeToBasket
      // function. Is it worth it to send a second GA ping to help us monitor the error
      // rate? If so, should I overload the button click interaction, as done below, or
      // use some other kind of category / action?
      sendToGA('event', {
        eventCategory: 'HomePage Interactions',
        eventAction: 'button click',
        eventLabel: 'email submitted to basket'
      });
    });

    this.setState({ isFirstPage: false });
  }

  skip(e) {
    const { sendToGA } = this.props;

    e.preventDefault();
    e.stopPropagation();

    sendToGA('event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'button click',
      // review TODO: The label says 'skip'. Should I just use that? Want to make
      // the events readable and specific on the GA side.
      eventLabel: 'Skip email'
    });

    this.close();
  }

  continue(e) {
    const { sendToGA } = this.props;

    e.preventDefault();

    sendToGA('event', {
      eventCategory: 'HomePage Interactions',
      eventAction: 'button click',
      eventLabel: 'On to the experiments'
    });

    this.close();
  }

  validate(email) {
    return emailValidator(email);
  }

  close() {
    if (this.props.onDismiss) { this.props.onDismiss(); }
  }

}

EmailDialog.propTypes = {
  onDismiss: React.PropTypes.func.isRequired,
  sendToGA: React.PropTypes.func.isRequired,
  subscribeToBasket: React.PropTypes.func.isRequired
};
