// @flow

import { Localized } from "fluent-react/compat";
import React from "react";

import Copter from "../components/Copter";
import LayoutWrapper from "../components/LayoutWrapper";
import LocalizedHtml from "../components/LocalizedHtml";
import View from "../components/View";

type ErrorPageProps = {
  uninstallAddon: Function,
  sendToGA: Function,
  openWindow: Function
}


export default class ErrorPage extends React.Component {
  props: ErrorPageProps

  render() {
    return (
      <View spaceBetween={true} showNewsletterFooter={false} {...this.props}>
        <LayoutWrapper flexModifier="column-center">
          <div id="four-oh-four" className="modal centered">
            <header className="modal-header-wrapper neutral-modal">
              <Localized id="errorHeading">
                <h1 className="modal-header">Whoops!</h1>
              </Localized>
            </header>
            <div className="modal-content">
              <LocalizedHtml id="errorMessage">
                <p>Looks like we broke something.<br />Maybe try again later.</p>
              </LocalizedHtml>
            </div>
          </div>
          <Copter animation="fade-in-fly-up" />
        </LayoutWrapper>
      </View>
    );
  }
}
