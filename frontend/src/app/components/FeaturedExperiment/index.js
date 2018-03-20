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
  experiment: Object,
  hasAddon: any,
  enabled: boolean,
  isFirefox: boolean,
  isMinFirefox: boolean,
  installed: InstalledExperiments,
  clientUUID?: string,
  eventCategory: string,
  isExperimentEnabled: Function,
  sendToGA: Function
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
    const { experiment, enabled, installed, hasAddon, eventCategory } = this.props;
    const { description, title, subtitle, slug, video_url, error } = experiment;

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
            <div className={`experiment-icon-wrapper-${slug} experiment-icon-wrapper`}>
              <div className={`experiment-icon-${slug} experiment-icon`}></div>
            </div>
            <div className="featured-experiment__title-wrapper">
              <h2 className="featured-experiment__title">{title}</h2>
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

          {!enabled && <Localized id='moreDetail'>
            <Link className="featured-experiment__details" to={`/experiments/${slug}`}
              onClick={() => {
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
              }}>View Details</Link>
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
<<<<<<< 6a8c3d1b74a963521f87f1a3952714ba470b769d
=======

        {showTourDialog && <ExperimentTourDialog {...this.props}
          onCancel={() => {
            this.onTourDialogComplete(true);
          }}
          onComplete={this.onTourDialogComplete}
        />}
>>>>>>> Auditing metrics for featured experiment
      </div>
    );
  }
}
