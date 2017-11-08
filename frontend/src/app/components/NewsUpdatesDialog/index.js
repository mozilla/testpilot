// @flow

import cn from 'classnames';
import { Localized } from 'fluent-react/compat';
import React from 'react';
import moment from 'moment';
import cookies from 'js-cookie';

import StepModal from '../StepModal';


type newsUpdatesDialogProps = {
  newsUpdates: Array<Object>,
  isExperimentEnabled: Function,
  onCancel: Function,
  onComplete: Function,
  sendToGA: Function
}

type newsUpdatesDialogState = {
  currentStep: number
}

export default class NewsUpdatesDialog extends React.Component {
  props: newsUpdatesDialogProps
  state: newsUpdatesDialogState

  constructor(props: newsUpdatesDialogProps) {
    super(props);
    this.state = { currentStep: 0 };
  }

  renderUpdate(newsUpdates: Array<Object>, currentStep: number) {
    return newsUpdates.map((u, idx) => (idx === currentStep) && (
        <div key={idx} className='step-content'>
          {u.image && <div className='step-image'><img src={u.image} /></div>}
          {u.content &&
            <div className='step-text'>
              <h2 className='lighter step-title'>{u.title}</h2>
              <p className='published-date lighter emphasis'>{moment(new Date(u.published)).format('dddd, MMMM Do YYYY')}</p>
              <p className='lighter'>{u.content}</p>
              {u.link && (<Localized id='learnMoreLink'>
                            <a className="learn" href={u.link}>LEARN MORE</a>
                          </Localized>)}
              <br/>
              {u.experimentSlug &&
                 <Localized id='viewExperimentPage'>
                   <a href={`experiments/${u.experimentSlug}`} className='button default'>View Experiment Page</a>
                  </Localized>}
            </div>}
        </div>
    ));
  }

  renderHeaderTitle(newsUpdates: Array<Object>, currentStep: number) {
    const { isExperimentEnabled } = this.props;
    const defaultNewsUpdateTitle = (<Localized id='nonExperimentDialogHeaderLink'>
                                      <h3 className='modal-header lighter'>Test Pilot</h3>
                                    </Localized>);

    return newsUpdates.map((u, idx) => (idx === currentStep) && (u.experimentSlug ?
       (<h3 className={cn('modal-header lighter', {
         enabled: isExperimentEnabled({ addon_id: `@${u.experimentSlug}` })
       })}>{u.experimentSlug.split('-').join(' ')}</h3>) : (defaultNewsUpdateTitle)
    ));
  }

  render() {
    const { sendToGA, newsUpdates } = this.props;
    const { currentStep } = this.state;

    const myProps = {
      steps: newsUpdates,
      onCancel: this.onCancel.bind(this),
      onComplete: this.onComplete.bind(this),
      renderStep: this.renderUpdate.bind(this),
      wrapperClass: 'news-updates-modal',
      headerTitle: this.renderHeaderTitle(newsUpdates, currentStep),
      stepNextPing: (newStep) => {
        sendToGA('event', {
          eventCategory: 'NewsUpdatesDialog Interactions',
          eventAction: 'button click',
          eventLabel: `forward to step ${newStep}`
        });
      },
      stepBackPing: (newStep) => {
        sendToGA('event', {
          eventCategory: 'NewsUpdatesDialog Interactions',
          eventAction: 'button click',
          eventLabel: `back to step ${newStep}`
        });
      },
      stepToDotPing: (index) => {
        sendToGA('event', {
          eventCategory: 'NewsUpdatesDialog Interactions',
          eventAction: 'button click',
          eventLabel: `dot to step ${index}`
        });
      }
    };

    return (<StepModal {...myProps} />);
  }

  onCancel(ev) {
    const { sendToGA, onCancel } = this.props;

    sendToGA('event', {
      eventCategory: 'NewsUpdatesDialog Interactions',
      eventAction: 'button click',
      eventLabel: 'cancel updates'
    });
    cookies.set('updates-last-viewed-date', new Date().toISOString());
    if (onCancel) onCancel(ev);
  }

  onComplete(ev) {
    const { sendToGA, onComplete } = this.props;

    sendToGA('event', {
      eventCategory: 'NewsUpdatesDialog Interactions',
      eventAction: 'button click',
      eventLabel: 'complete updates'
    });
    cookies.set('updates-last-viewed-date', new Date().toISOString());
    if (onComplete) { onComplete(ev); }
  }
}
