// @flow

import classnames from 'classnames';
import { Localized } from 'fluent-react/compat';
import moment from 'moment';
import React from 'react';

import LayoutWrapper from '../LayoutWrapper';
import { newsUpdateL10nId } from '../../lib/utils';

import './index.scss';

export function prettyDate(date: string) {
  return moment(date).format('MMMM Do, YYYY');
}

type UpdateProps = {
  sendToGA: Function,
  experiment: Object,
  update: Object
};

export class Update extends React.Component {
  props: UpdateProps;

  render() {
    const { experiment, update } = this.props;
    const { created, published, title, content, link } = update;

    const categoryTitle = experiment ? experiment.title : 'Firefox Test Pilot';
    const categoryTitleL10nID = experiment ? null : 'siteName';
    const iconClassName = experiment
      ? `experiment-icon-${experiment.slug}`
      : 'news-update-test-pilot-icon';

    return (
      <a className={classnames('update', { 'has-link': !!link })}
          href={link}
          onClick={() => this.handleLinkClick()}>
        <div className={classnames(iconClassName, 'update-experiment-icon')} />
        <div className="update-content">
          <header>
            {experiment
              ? <Localized id={categoryTitleL10nID}>
                  <h2>
                    {categoryTitle}
                  </h2>
                </Localized>
              : <Localized id={newsUpdateL10nId(update, 'title')}>
                  <h2 className="update-title">
                    {title}
                  </h2>
                </Localized>}
            <p className="up-date">
              {prettyDate(published || created)}
            </p>
          </header>
          {experiment
            ? <Localized id={newsUpdateL10nId(update, 'title')}>
                <h4 className="update-title">
                  {title}
                </h4>
              </Localized>
            : null}
          <Localized id={newsUpdateL10nId(update, 'content')}>
            <p className="summary">
              {content}
            </p>
          </Localized>
        </div>
        <div className="link-chevron">
          <span className="chevron">&nbsp;</span>
        </div>
      </a>
    );
  }

  handleLinkClick() {
    const { sendToGA, update } = this.props;
    const { slug, link } = update;

    if (!link) return;

    sendToGA('event', {
      eventCategory: 'ExperimentsPage Interactions',
      eventAction: 'click',
      eventLabel: `news-item-${slug}`
    });
  }
}

type UpdateListProps = {
  sendToGA: Function,
  staleNewsUpdates: Array<Object>,
  freshNewsUpdates: Array<Object>,
  experiments: Array<Object>,
  initialShowMoreNews?: boolean
};

type UpdateListState = {
  showMoreNews: boolean
};

export default class UpdateList extends React.Component {
  props: UpdateListProps;
  state: UpdateListState;

  constructor(props: UpdateListProps) {
    super(props);
    this.state = {
      showMoreNews: !!props.initialShowMoreNews
    };
  }

  render() {
    const { sendToGA, staleNewsUpdates, freshNewsUpdates, experiments } = this.props;
    const { showMoreNews } = this.state;

    const hasStaleNewsUpdates = staleNewsUpdates && staleNewsUpdates.length > 0;
    const shouldShowStaleNewsUpdates = showMoreNews && hasStaleNewsUpdates;
    const shouldShowMoreNewsButton = !showMoreNews && hasStaleNewsUpdates;

    const shownNewsUpdates = shouldShowStaleNewsUpdates
      ? [].concat(freshNewsUpdates, staleNewsUpdates.slice(0, 5))
      : freshNewsUpdates;

    if (!shownNewsUpdates || shownNewsUpdates.length === 0) {
      // If no updates, render as nothing - not even the header.
      return null;
    }

    const experimentsBySlug = {};
    experiments.forEach(
      experiment => (experimentsBySlug[experiment.slug] = experiment)
    );

    return (
      <div className="update-list">
        <Localized id="latestUpdatesTitle">
          <h1 className="update-list-heading">Latest Updates</h1>
        </Localized>
        <LayoutWrapper flexModifier="column-center">
          {shownNewsUpdates.map((update, index) =>
            <Update
              key={index}
              sendToGA={sendToGA}
              update={update}
              experiment={experimentsBySlug[update.experimentSlug]}
            />
          )}
        </LayoutWrapper>
        {shouldShowMoreNewsButton &&
          <LayoutWrapper flexModifier="card-list">
            <Localized id="showMoreNewsTitle">
              <div className={classnames(['button', 'more-news', 'outline'])}
                  onClick={() => this.handleShowMoreNews()}>
                Show Past News
              </div>
            </Localized>
          </LayoutWrapper>}
      </div>
    );
  }

  handleShowMoreNews() {
    this.setState({ showMoreNews: true });
  }
}
