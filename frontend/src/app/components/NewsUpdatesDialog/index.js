// @flow

import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React from "react";
import moment from "moment";
import cookies from "js-cookie";

import StepModal from "../StepModal";

import "./index.scss";

type newsUpdatesDialogProps = {
  newsUpdates: Array<Object>,
  isExperimentEnabled: Function,
  onCancel: Function,
  onComplete: Function,
  sendToGA: Function
}

export default class NewsUpdatesDialog extends React.Component {
  props: newsUpdatesDialogProps

  stepNextPing = (newStep: number) => {
    this.props.sendToGA("event", {
      eventCategory: "NewsUpdatesDialog Interactions",
      eventAction: "button click",
      eventLabel: `forward to step ${newStep}`
    });
  };

  stepBackPing = (newStep: number) => {
    this.props.sendToGA("event", {
      eventCategory: "NewsUpdatesDialog Interactions",
      eventAction: "button click",
      eventLabel: `back to step ${newStep}`
    });
  };

  stepToDotPing = (index: number) => {
    this.props.sendToGA("event", {
      eventCategory: "NewsUpdatesDialog Interactions",
      eventAction: "button click",
      eventLabel: `dot to step ${index}`
    });
  };

  renderUpdate = (newsUpdates: Array<Object>, currentStep: number) => {
    return newsUpdates.map((u, idx) => (idx === currentStep) && (
      <div key={idx} className='step-content'>
        {u.image && <div className='step-image'><img src={u.image} /></div>}
        {u.content &&
          <div className='step-text'>
            <h2 className='lighter step-title'>{u.title}</h2>
            <p className='published-date small-font'>{moment(new Date(u.published)).format("dddd, MMMM Do YYYY")}</p>
            <p>{u.content}</p>
            {u.link && (<Localized id='experimentCardLearnMore'>
              <a className="learn" href={u.link}>Learn more</a>
            </Localized>)}
            {u.link && (<br/>)}
            {u.experimentSlug &&
              <Localized id='viewExperimentPage'>
                <a href={`experiments/${u.experimentSlug}`} className='button default'>View Experiment Page</a>
              </Localized>
            }
          </div>
        }
      </div>
    ));
  };

  renderHeaderTitle = (newsUpdates: Array<Object>, currentStep: number) => {
    const { isExperimentEnabled } = this.props;
    const defaultNewsUpdateTitle = (<Localized id='nonExperimentDialogHeaderLink'>
      <h3 className='modal-header lighter'>Test Pilot</h3>
    </Localized>);

    return newsUpdates.map((u, idx) => (idx === currentStep) && (u.experimentSlug ?
      (<h3 className={cn("modal-header lighter", {
        enabled: isExperimentEnabled({ addon_id: `@${u.experimentSlug}` })
      })}>{u.experimentSlug.split("-").join(" ")}</h3>) : (defaultNewsUpdateTitle)
    ));
  };

  render() {
    return (<StepModal
      steps={this.props.newsUpdates}
      wrapperClass={"news-updates-modal"}
      onCancel={this.onCancel}
      onComplete={this.onComplete}
      renderStep={this.renderUpdate}
      renderHeaderTitle={this.renderHeaderTitle}
      stepNextPing={this.stepNextPing}
      stepBackPing={this.stepBackPing}
      stepToDotPing={this.stepToDotPing}
    />);
  }

  onCancel = (ev: Object) => {
    const { sendToGA, onCancel } = this.props;

    sendToGA("event", {
      eventCategory: "NewsUpdatesDialog Interactions",
      eventAction: "button click",
      eventLabel: "cancel updates"
    });
    cookies.set("updates-last-viewed-date", new Date().toISOString());
    if (onCancel) onCancel(ev);
  };

  onComplete = (ev: Object) => {
    const { sendToGA, onComplete } = this.props;

    sendToGA("event", {
      eventCategory: "NewsUpdatesDialog Interactions",
      eventAction: "button click",
      eventLabel: "complete updates"
    });
    cookies.set("updates-last-viewed-date", new Date().toISOString());
    if (onComplete) { onComplete(ev); }
  };
}
