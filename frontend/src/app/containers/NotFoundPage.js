import { Localized } from "fluent-react/compat";
import React from "react";

import Copter from "../components/Copter";
import LayoutWrapper from "../components/LayoutWrapper";
import View from "../components/View";


export default class NotFoundPage extends React.Component {
  render() {
    return (
      <View centered={true} showNewsletterFooter={false} showFooter={false} showHeader={false}
        {...this.props}>
        <LayoutWrapper flexModifier="column-center">
          <div id="four-oh-four" className="modal not-found-modal">
            <div className="not-found-icon"></div>
            <Localized id="notFoundHeader">
              <h1 className="title">Four Oh Four!</h1>
            </Localized>
            <div className="modal-actions">
              <Localized id="home">
                <a className="button default large" href="/">Home</a>
              </Localized>
            </div>
          </div>
          <Copter animation="fade-in-fly-up"/>
        </LayoutWrapper>
      </View>
    );
  }
}
