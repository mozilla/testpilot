import React from "react";

import Copter from "../../components/Copter";
import LayoutWrapper from "../../components/LayoutWrapper";
import View from "../../components/View";


export default class LegacyPage extends React.Component {
  render() {
    return (
      <View spaceBetween={true} showNewsletterFooter={false} {...this.props}>
        <LayoutWrapper flexModifier="column-center">
          <div id="legacy-modal" className="modal">
            <div className="modal-content">
              <br/><br/>
              <p>Hello there! Once upon a time, you installed an add-on called Test Pilot for Firefox.</p>
              <br/>
              <p>Well the Test Pilot program for trying experimental features in Firefox is back, and we thought you might like to check it out.</p>
              <br/>
              <p>The old add-on has been uninstalled for you. If you&apos;d like the new one, just click the link.</p>
              <br/>
              <p>If you&apos;re not interested, simply close this tab and get back to browsing.</p>
              <br/>
            </div>
            <div className="modal-actions">
              <a className="button default large" href="/?utm_source=testpilot_legacy&utm_medium=firefox-browser">Check out Test Pilot</a>
            </div>
          </div>
          <Copter animation="fade-in-fly-up"/>
        </LayoutWrapper>
      </View>
    );
  }
}
