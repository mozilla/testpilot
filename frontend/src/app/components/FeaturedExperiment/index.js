// @flow

import { Localized } from "fluent-react/compat";
import React from "react";
import { Link } from "react-router-dom";

import { experimentL10nId } from "../../lib/utils";
import { getBreakpoint } from "../../containers/App";

import FeaturedStatus from "./FeaturedStatus";
import FeaturedButton from "./FeaturedButton";

import "./index.scss";

import type { InstalledExperiments } from "../../reducers/addon";

import ExperimentPlatforms from "../ExperimentPlatforms";

type FeaturedExperimentProps = {
  clientUUID?: string,
  enabled: boolean,
  eventCategory: string,
  experiment: Object,
  fetchCountryCode: Function,
  getWindowLocation: Function,
  hasAddon: any,
  isFirefox: boolean,
  isExperimentEnabled: Function,
  isMinFirefox: boolean,
  installed: InstalledExperiments,
  sendToGA: Function,
  userAgent: string
}

export default class FeaturedExperiment extends React.Component {
  props: FeaturedExperimentProps

  constructor(props: FeaturedExperimentProps) {
    super(props);
  }

  l10nId(pieces: string) {
    return experimentL10nId(this.props.experiment, pieces);
  }

  render() {
    const { experiment, enabled, installed, hasAddon, sendToGA,
      eventCategory } = this.props;
    const { description, title, subtitle, slug, video_url, error, platforms } = experiment;
    const isMobileExperiment = platforms.includes("ios") || platforms.includes("android");

    const handleDetailsLinkClick = () => {
      sendToGA("event", {
        eventCategory,
        eventAction: "link click",
        eventLabel: "View Featured details",
        dimension1: hasAddon,
        dimension2: Object.keys(installed).length > 0,
        dimension3: Object.keys(installed).length,
        dimension4: enabled,
        dimension10: getBreakpoint(window.innerWidth),
        dimension11: slug,
        dimension13: "Featured Experiment"
      });
    };

    return (
      <div>
        { error && <div className="status-bar error featured">
          <Localized id="installErrorMessage" $title={title}>
            <span>
              Uh oh. {title} could not be enabled. Try again later.
            </span>
          </Localized>
        </div>}
        <div className="featured-experiment">
          <FeaturedStatus {...this.props} />
          <header className="featured-experiment__header">
            <Link to={`/experiments/${slug}`} onClick={handleDetailsLinkClick}>
              <div className={`experiment-icon-wrapper-${slug} experiment-icon-wrapper`}>
                <div className={`experiment-icon-${slug} experiment-icon`}></div>
              </div>
            </Link>
            <div className="featured-experiment__title-wrapper">
              <Link to={`/experiments/${slug}`} onClick={handleDetailsLinkClick}>
                <h2 className="featured-experiment__title">{title}</h2>
              </Link>
              <div className="featured-experiment__info">
                <ExperimentPlatforms experiment={experiment} />
                {subtitle && <Localized id={this.l10nId("subtitle")}>
                  <h4 className="featured-experiment__subtitle">{subtitle}</h4>
                </Localized>}
              </div>
            </div>
          </header>

          <Localized id={this.l10nId("description")}>
            <p className="featured-experiment__description">{description}</p>
          </Localized>

          {(!enabled || isMobileExperiment) && <Localized id='moreDetail'>
            <Link className="featured-experiment__details" to={`/experiments/${slug}`}
              onClick={handleDetailsLinkClick}>View Details</Link>
          </Localized>}

          <div className="featured-experiment__actions">
            <FeaturedButton {...this.props} />
          </div>

          <div className="featured-experiment__video">
            <iframe
              width="100%"
              height="360"
              src={video_url}
              frameBorder="0"
              allowFullScreen />
          </div>
        </div>
      </div>
    );
  }
}
