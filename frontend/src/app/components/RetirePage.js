import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

export default class RetirePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fakeUninstalled: false
    };
  }

  componentDidMount() {
    // HACK: Older add-on versions give no reliable signal of having been
    // uninstalled, so let's fake it.
    this.fakeUninstallTimer = setTimeout(() => {
      this.setState({ fakeUninstalled: true });
      this.props.setNavigatorTestpilotAddon(false);
    }, this.props.fakeUninstallDelay);
  }

  componentWillUnmount() {
    clearTimeout(this.fakeUninstallTimer);
  }

  render() {
    const { hasAddon } = this.props;
    const { fakeUninstalled } = this.state;

    const uninstalled = !hasAddon || fakeUninstalled;
    if (uninstalled) {
      clearTimeout(this.fakeUninstallTimer);
    }

    return (
      <div className="full-page-wrapper centered">
        <div className="centered-banner">
            {!uninstalled && <div disabled className={classnames('loading-pill')}>
              <h1 className="emphasis" data-l10n-id="retirePageProgressMessage">Shutting down...</h1>
              <div style={{ opacity: 1 }} className="state-change-inner"></div>
            </div>}
            {uninstalled && <div>
              <div id="retire" className="modal fade-in">
                <h1 data-l10n-id="retirePageHeadline" className="title">Thanks for flying!</h1>
                <div className="modal-content">
                  <p data-l10n-id="retirePageMessage">Hope you had fun experimenting with us. <br /> Come back any time.</p>
                </div>
                <div className="modal-actions">
                  <a onClick={() => this.takeSurvey()} data-l10n-id="retirePageSurveyButton" data-hook="take-survey" href="https://qsurvey.mozilla.com/s3/test-pilot" target="_blank" className="button default large">Take a quick survey</a>
                  <Link to="/"  data-l10n-id="home" className="modal-escape">Home</Link>
                </div>
              </div>
              <div className="copter-wrapper">
                <div className="copter fade-in"></div>
              </div>
            </div>}
        </div>
      </div>
    );
  }

  takeSurvey() {
    this.props.sendToGA('event', {
      eventCategory: 'RetirePage Interactions',
      eventAction: 'button click',
      eventLabel: 'take survey'
    });
  }
}

RetirePage.propTypes = {
  setNavigatorTestpilotAddon: React.PropTypes.func,
  fakeUninstallDelay: React.PropTypes.number
};

RetirePage.defaultProps = {
  fakeUninstallDelay: 5000
};
