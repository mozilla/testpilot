
import React from 'react';

import './index.scss';


class GraduatedNoticeButton extends React.Component {
  render() {
    return <a className="graduated-notice-button" href={this.props.graduation_url}>
      Graduation Report
    </a>;
  }
}

export default class GraduatedNotice extends React.Component {
  render() {
    return <div className="graduated-notice">
      <img className="graduated-notice-image" src="/static/images/info-16.svg" />
      <div className="graduated-notice-text">
        <h1>
          This experiment has ended
        </h1>
        <p>
          {this.props.graduation_url
            ? 'We have prepared a full graduation report.'
            : 'We are working on a full report. Check back soon for the details.' }
        </p>
      </div>
        {this.props.graduation_url ? <GraduatedNoticeButton graduation_url={this.props.graduation_url} /> : null}
    </div>;
  }
}

