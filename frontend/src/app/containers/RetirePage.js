// @flow

import React from 'react';
import classnames from 'classnames';

import Copter from '../components/Copter';
import LayoutWrapper from '../components/LayoutWrapper';
import View from '../components/View';


type RetirePageProps = {
  setHasAddon: Function,
  sendToGA: Function,
  fakeUninstallDelay?: number
}

type RetirePageState = {
  fakeUninstalled: boolean
}

export default class RetirePage extends React.Component {
  props: RetirePageProps
  state: RetirePageState
  fakeUninstallTimer: any

  static defaultProps = {
    fakeUninstallDelay: 5000
  };

  constructor(props: RetirePageProps) {
    super(props);
    this.state = {
      fakeUninstalled: false
    };
  }

  componentDidMount() {
    // HACK: The add-on gets uninstalled too quickly, so let's
    // show the user the uninstalling dialog for at least a
    // few seconds.
    this.fakeUninstallTimer = setTimeout(() => {
      this.setState({ fakeUninstalled: true });
      this.props.setHasAddon(false);
    }, this.props.fakeUninstallDelay);
  }

  componentWillUnmount() {
    clearTimeout(this.fakeUninstallTimer);
  }

  render() {
    const { fakeUninstalled } = this.state;

    const uninstalled = fakeUninstalled;
    if (uninstalled) {
      clearTimeout(this.fakeUninstallTimer);
    }

    return (
      <View centered={true} showHeader={false} showFooter={false} showNewsletterFooter={false} {...this.props}>
        <LayoutWrapper flexModifier="column-center">
          {!uninstalled && <div disabled className={classnames('loading-pill')}>
            <h1 className="emphasis" data-l10n-id="retirePageProgressMessage">Shutting down...</h1>
            <div className="state-change-inner">&nbsp;</div>
          </div>}
          {uninstalled && <LayoutWrapper flexModifier="column-center">
            <div id="retire" className="modal centered">
              <div className="modal-header-wrapper">
                <h1 data-l10n-id="retirePageHeadline" className="modal-header">Thanks for flying!</h1>
              </div>
              <div className="modal-content">
                <p data-l10n-id="retirePageMessage">Hope you had fun experimenting with us. <br /> Come back any time.</p>
              </div>
              <div className="modal-actions">
                <a onClick={() => this.takeSurvey()} data-l10n-id="retirePageSurveyButton" href="https://qsurvey.mozilla.com/s3/test-pilot" target="_blank" className="button default large">Take a quick survey</a>
                <a href="/"  data-l10n-id="home" className="modal-escape">Home</a>
              </div>
            </div>
            <Copter animation="fade-in-fly-up" />
          </LayoutWrapper>}
        </LayoutWrapper>
      </View>
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
