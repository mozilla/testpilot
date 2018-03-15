// @flow
import classnames from "classnames";
import { Localized } from "fluent-react/compat";
import React from "react";
import { Link } from "react-router-dom";

import Copter from "../../components/Copter";
import LayoutWrapper from "../../components/LayoutWrapper";
import LocalizedHtml from "../../components/LocalizedHtml";
import View from "../../components/View";

import "./index.scss";

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
          {!uninstalled && <div disabled className={classnames("loading-pill")}>
            <Localized id="retirePageProgressMessage">
              <h1 className="emphasis">Shutting down...</h1>
            </Localized>
            <div className="state-change-inner">&nbsp;</div>
          </div>}
          {uninstalled && <LayoutWrapper flexModifier="column-center">
            <div id="retire" className="modal centered retire-modal">
              <div className="modal-header-wrapper">
                <Localized id="retirePageHeadline">
                  <h1 className="modal-header">Thanks for flying!</h1>
                </Localized>
              </div>
              <div className="modal-content">
                <div className="flying-icon"></div>
                <LocalizedHtml id="retirePageMessage">
                  <p>Hope you had fun experimenting with us. <br/> Come back any time.</p>
                </LocalizedHtml>
              </div>
              <div className="modal-actions">
                <Localized id="retirePageSurveyButton">
                  <a onClick={() => this.takeSurvey()} href="https://qsurvey.mozilla.com/s3/test-pilot" target="_blank" rel="noopener noreferrer" className="button default large">Take a quick survey</a>
                </Localized>
                <Localized id="home">
                  <Link to="/" className="modal-escape">Home</Link>
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
    this.props.sendToGA("event", {
      eventCategory: "RetirePage Interactions",
      eventAction: "button click",
      eventLabel: "take survey"
    });
  }
}
