// @flow

import cn from 'classnames';
import { Localized } from 'fluent-react/compat';
import React from 'react';
import moment from 'moment';
import cookies from 'js-cookie';

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
        <div key={idx} className='tour-content'>
          {u.image && <div className='tour-image'><img src={u.image} /></div>}
          {u.content &&
            <div className='tour-text'>
              <h2 className='lighter tour-title'>{u.title}</h2>
              <p className='published-date lighter'>{moment(new Date(u.published)).format('dddd, MMMM Do YYYY')}</p>
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
    const { newsUpdates } = this.props;
    const { currentStep } = this.state;

    const atStart = (currentStep === 0);
    const atEnd   = (currentStep === newsUpdates.length - 1);
    const update = this.renderUpdate(newsUpdates, currentStep);
    const headerTitle = this.renderHeaderTitle(newsUpdates, currentStep);

    return (
      <div className='modal-container'>
        <div className='modal news-updates-modal'>
          <header className='modal-header-wrapper'>{headerTitle}</header>
          {update}
          <div className='tour-actions'>
            <div onClick={() => this.stepBack()} className={cn('tour-back', { hidden: atStart })}><div/></div>
            <div onClick={() => this.stepNext()} className={cn('tour-next', { 'no-display': atEnd })}><div/></div>
            <Localized id='tourDoneButton'>
              <div onClick={e => this.complete(e)} className={cn('tour-done', { 'no-display': !atEnd })}>Done</div>
            </Localized>
          </div>
          <div className="tour-general-actions">
            <div className='modal-skip' onClick={e => this.cancel(e)}>Skip</div>
            <div className="dot-wrap"><div className="dot-row">{this.renderDots(newsUpdates, currentStep)}</div></div>
          </div>
        </div>
      </div>
    );
  }

  renderDots(newsUpdates: Array<any>, currentStep: number) {
    const dots = newsUpdates.map((el, index) => {
      if (currentStep === index) return (<div key={index} className="current dot"></div>);
      return (<div key={index} className="dot" onClick={e => this.stepToDot(e, index)} ></div>);
    });

    return dots;
  }

  cancel(e: Object) {
    e.preventDefault();
    this.props.sendToGA('event', {
      eventCategory: 'NewsUpdatesDialog Interactions',
      eventAction: 'button click',
      eventLabel: 'cancel updates'
    });
    cookies.set('updates-last-viewed-date', new Date().toISOString());
    if (this.props.onCancel) this.props.onCancel(e);
  }

  complete(e: Object) {
    e.preventDefault();
    this.props.sendToGA('event', {
      eventCategory: 'NewsUpdatesDialog Interactions',
      eventAction: 'button click',
      eventLabel: 'complete updates'
    });
    cookies.set('updates-last-viewed-date', new Date().toISOString());
    if (this.props.onComplete) { this.props.onComplete(e); }
  }

  stepToDot(e: Object, index: number) {
    e.preventDefault();
    this.setState({ currentStep: index });

    this.props.sendToGA('event', {
      eventCategory: 'NewsUpdatesDialog Interactions',
      eventAction: 'button click',
      eventLabel: `dot to step ${index}`
    });
  }

  stepBack() {
    const { currentStep } = this.state;

    const newStep = Math.max(currentStep - 1, 0);
    this.setState({ currentStep: newStep });

    this.props.sendToGA('event', {
      eventCategory: 'NewsUpdatesDialog Interactions',
      eventAction: 'button click',
      eventLabel: `back to step ${newStep}`
    });
  }

  stepNext() {
    const { newsUpdates, sendToGA } = this.props;
    const { currentStep } = this.state;

    const newStep = Math.min(currentStep + 1,
                             newsUpdates.length - 1);
    this.setState({ currentStep: newStep });

    sendToGA('event', {
      eventCategory: 'NewsUpdatesDialog Interactions',
      eventAction: 'button click',
      eventLabel: `forward to step ${newStep}`
    });
  }
}
