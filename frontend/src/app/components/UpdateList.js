// @flow

import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
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
              <h2 data-l10n-id={categoryTitleL10nID}>{categoryTitle}</h2>
              <p className="up-date">{prettyDate(published || created)}</p>
            </header>
            <h4 data-l10n-id={newsUpdateL10nId(update, 'title')}>{title}</h4>
            <p data-l10n-id={newsUpdateL10nId(update, 'content')} className="summary">{content}</p>
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
        <h1 className="emphasis update-list-heading" data-l10n-id="latestUpdatesTitle">Latest Updates</h1>
        <LayoutWrapper flexModifier="column-center">
          {newsUpdates.map((update, index) =>
            <Update key={index} update={update}
                    experiment={experimentsBySlug[update.experimentSlug]} />)}
        </LayoutWrapper>
      </div>
    );
  }
}
