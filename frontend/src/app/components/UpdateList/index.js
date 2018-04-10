// @flow

import classnames from "classnames";
import { Localized } from "fluent-react/compat";
import moment from "moment";
import React from "react";

import LayoutWrapper from "../LayoutWrapper";
import { newsUpdateL10nId } from "../../lib/utils";

import "./index.scss";

export function prettyDate(date: string) {
  return moment(date).format("MMMM Do, YYYY");
}

const TWO_WEEKS = 2 * 7 * 24 * 60 * 60 * 1000;
const twoWeeksAgo = new Date() - TWO_WEEKS;

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

    const gradient_stop = experiment ? experiment.gradient_stop : "transparent";

    const categoryTitle = experiment ? experiment.title : "Firefox Test Pilot";
    const categoryTitleL10nID = experiment ? null : "siteName";
    const iconClassName = experiment
      ? `experiment-icon-${experiment.slug}`
      : "news-update-test-pilot-icon";
    const iconWrapperClassName = experiment
      ? `experiment-icon-wrapper-${experiment.slug}`
      : "news-update-test-pilot-icon-wrapper";

    const isNew = experiment ? new Date(experiment.published) < twoWeeksAgo : false;
    const nonEn = typeof window !== "undefined" ? window.navigator.language !== "en-US" : false;

    return (
      <a className={classnames("update", { "has-link": !!link })}
        href={link}
        onClick={() => this.handleLinkClick()}>
        <div className={classnames(iconWrapperClassName, "update-experiment-icon-wrapper")}>
          <div className={classnames(iconClassName, "update-experiment-icon")} style={ { backgroundColor: gradient_stop } }/>
        </div>
        <div className="update-content">
          <header>
            {experiment
              ? <Localized id={categoryTitleL10nID}>
                <h2>
                  {categoryTitle}
                </h2>
              </Localized>
              : <Localized id={newsUpdateL10nId(update, "title")}>
                <h2 className="update-title">
                  {title}
                </h2>
              </Localized>}
            <p className="up-date">
              {prettyDate(published || created)}
            </p>
            {isNew && <div className="star-wrap">
              <div className="star-icon"></div>
              <p className="new">new</p>
            </div>}
          </header>
          {experiment
            ? <Localized id={newsUpdateL10nId(update, "title")}>
              <h4 className="update-title">
                {title}
              </h4>
            </Localized>
            : null}
          <Localized id={newsUpdateL10nId(update, "content")}>
            <p className="summary">
              {content}
            </p>
          </Localized>
          {nonEn && !!link && <div className="en-article-notice">
            <Localized id={"englishArticleLink"}>
              <p>Link to English article</p>
            </Localized>
            <span className="en-link-icon">&nbsp;</span>
          </div>}
        </div>
        <div className="link-chevron">
          <span className="chevron">&nbsp;</span>
        </div>
      </a>
    );
  }

  handleLinkClick() {
    const { experiment, sendToGA, update } = this.props;
    const { slug, link } = update;
    const { slug: experimentSlug } = experiment;

    if (!link) return;

    sendToGA("event", {
      eventCategory: "ExperimentsPage Interactions",
      eventAction: "click",
      eventLabel: `news-item-${slug}`,
      dimension11: experimentSlug
    });
  }
}

type UpdateListProps = {
  sendToGA: Function,
  staleNewsUpdates: Array<Object>,
  freshNewsUpdates: Array<Object>,
  experiments: Array<Object>,
  initialShowMoreNews?: boolean,
  hideHeader?: boolean
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
    const { sendToGA, staleNewsUpdates, freshNewsUpdates, experiments, hideHeader } = this.props;
    const { showMoreNews } = this.state;

    const hasStaleNewsUpdates = staleNewsUpdates && staleNewsUpdates.length > 0;
    const shouldShowStaleNewsUpdates = showMoreNews && hasStaleNewsUpdates;
    const shouldShowMoreNewsButton = !showMoreNews && hasStaleNewsUpdates;

    const shownNewsUpdates = shouldShowStaleNewsUpdates
      ? [].concat(freshNewsUpdates, staleNewsUpdates.slice(0, 10))
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
        {!hideHeader && <Localized id="latestUpdatesTitle">
          <h1 className="update-list-heading">Latest Updates</h1>
        </Localized>}
        <LayoutWrapper flexModifier="column-center">
          {shownNewsUpdates.map(update =>
            <Update
              key={update.slug}
              sendToGA={sendToGA}
              update={update}
              experiment={experimentsBySlug[update.experimentSlug]}
            />
          )}
        </LayoutWrapper>
        {shouldShowMoreNewsButton &&
          <LayoutWrapper flexModifier="card-list">
            <Localized id="showMoreNewsTitle">
              <div className={classnames(["button", "more-news", "outline"])}
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
