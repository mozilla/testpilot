import React from 'react';

export default class DiscussDialog extends React.Component {
  render() {
    return (
      <div className="modal-container">
        <div id="discuss-modal" className="modal feedback-modal modal-bounce-in">
          <header>
            <h3 className="title" data-l10n-id="discussNotifyTitle">Just one second...</h3>
          </header>
          <form>

            <div className="modal-content modal-form">
              <div data-l10n-id="discussNotifyMessageAccountless" className="centered">
                <p>In the spirit of experimentation, we are using an external forum service. You will need to create an account if you wish to participate on the forums.</p>
                <p>If you don't feel like creating another account, you can
                   always leave feedback through Test Pilot.
                <br />
                   (We really do read this stuff)
                </p>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={e => this.submit(e)} data-l10n-id="discussNotifySubmitButton" className="submit button large default">Take me to the forum</button>
              <a onClick={e => this.cancel(e)} data-l10n-id="discussNotifyCancelButton" className="cancel modal-escape" href="">Cancel</a>
            </div>
          </form>
        </div>
      </div>
    );
  }

  submit(e) {
    const { onDismiss, openWindow, href } = this.props;
    e.preventDefault();
    openWindow(href, 'testpilotdiscuss');
    onDismiss();
  }

  cancel(e) {
    e.preventDefault();
    this.props.onDismiss();
  }

}

DiscussDialog.propTypes = {
  onDismiss: React.PropTypes.func.isRequired,
  openWindow: React.PropTypes.func.isRequired,
  href: React.PropTypes.string.isRequired
};
