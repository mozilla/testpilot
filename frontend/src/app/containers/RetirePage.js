// @flow
import classnames from 'classnames';
import { Localized } from 'fluent-react/compat';
import React from 'react';

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
            <Localized id="retirePageProgressMessage">
              <h1 className="emphasis">Shutting down...</h1>
            </Localized>
            <div className="state-change-inner">&nbsp;</div>
          </div>}
          {uninstalled && <LayoutWrapper flexModifier="column-center">
            <div id="retire" className="modal centered">
              <div className="modal-header-wrapper">
                <Localized id="retirePageHeadline">
                  <h1 className="modal-header">Thanks for flying!</h1>
                </Localized>
              </div>
              <div className="modal-content">
                <Localized id="retirePageMessage2">
                  <p>Hope you had fun experimenting with us.</p>
                </Localized>
                <Localized id="retirePageMessageComeBack">
                  <p>Come back any time.</p>
                </Localized>
              </div>
              <div className="modal-actions">
                <Localized id="retirePageSurveyButton">
                  <a onClick={() => this.takeSurvey()} href="https://qsurvey.mozilla.com/s3/test-pilot" target="_blank" rel="noopener noreferrer" className="button default large">Take a quick survey</a>
                </Localized>
                <Localized id="home">
                  <a href="/" className="modal-escape">Home</a>
                </Localized>
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
