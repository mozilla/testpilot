import { Localized } from "fluent-react/compat";
import React from "react";

import "./index.scss";

import iconInfo from "../../../images/info-16.svg";

class GraduatedNoticeButton extends React.Component {
  render() {
    return <Localized id="experimentGradReportButton">
      <a className="graduated-notice-button button default" href={this.props.graduation_url}>
        Graduation Report
      </a>
    </Localized>;
  }
}

export default class GraduatedNotice extends React.Component {
  render() {
    let graduatedText;
    if (this.props.graduation_url) {
      graduatedText = <Localized id="experimentGradReportReady">
        <p>
          We have prepared a full graduation report.
        </p>
      </Localized>;
    } else {
      graduatedText = <Localized id="experimentGradReportPendingCopy">
        <p>
          We are working on a full report. Check back soon for the details.
        </p>
      </Localized>;
    }
    return <div className="graduated-notice">
      <img className="graduated-notice-image" src={iconInfo} width="40" height="40"/>
      <div className="graduated-notice-text">
        <Localized id="experimentGradReportPendingTitle">
          <h1>
            This experiment has ended
          </h1>
        </Localized>
        {graduatedText}
      </div>
      {this.props.graduation_url ? <GraduatedNoticeButton graduation_url={this.props.graduation_url} /> : null}
    </div>;
  }
}
