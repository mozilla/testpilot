// @flow

import classnames from 'classnames';
import { Localized } from 'fluent-react';
import moment from 'moment';
import React from 'react';

import LayoutWrapper from './LayoutWrapper';
import { newsUpdateL10nId } from '../lib/utils';

export function prettyDate(date: string) {
  return moment(date).format('MMMM Do, YYYY');
}

type UpdateProps = {
  experiment: Object,
  update: Object
};

export class Update extends React.Component {
  props: UpdateProps

  render() {
    const { experiment, update } = this.props;
    const { created, published, title, content, link } = update;

    const categoryTitle = experiment ? experiment.title : 'Firefox Test Pilot';
    const categoryTitleL10nID = experiment ? null : 'siteName';
    const iconClassName = experiment ? `experiment-icon-${experiment.slug}` :
      'news-update-test-pilot-icon';

    return (
        <a className={classnames('update', { 'has-link': !!link })} href={link}>
          <div className={classnames(iconClassName, 'experiment-icon')}></div>
          <div className="update-content">
            <header>
              <Localized id={categoryTitleL10nID}>
                <h2>{categoryTitle}</h2>
              </Localized>
              <p className="up-date">{prettyDate(published || created)}</p>
            </header>
            <Localized id={newsUpdateL10nId(update, 'title')}>
              <h4>{title}</h4>
            </Localized>
            <Localized id={newsUpdateL10nId(update, 'content')}>
              <p className="summary">{content}</p>
            </Localized>
          </div>
          <div className="link-chevron">
            <span className="chevron">&nbsp;</span>
          </div>
        </a>
    );
  }
}

type UpdateListProps = {
  newsUpdates: Array<Object>,
  experiments: Array<Object>
};

export default class UpdateList extends React.Component {
  props: UpdateListProps

  render() {
    const { newsUpdates, experiments } = this.props;
    if (!newsUpdates || newsUpdates.length === 0) {
      // If no updates, render as nothing - not even the header.
      return null;
    }

    const experimentsBySlug = {};
    experiments.forEach(experiment => experimentsBySlug[experiment.slug] = experiment);

    return (
      <div className="update-list">
        <Localized id="latestUpdatesTitle">
          <h1 className="emphasis update-list-heading">Latest Updates</h1>
        </Localized>
        <LayoutWrapper flexModifier="column-center">
          {newsUpdates.map((update, index) =>
            <Update key={index} update={update}
                    experiment={experimentsBySlug[update.experimentSlug]} />)}
        </LayoutWrapper>
      </div>
    );
  }
}
