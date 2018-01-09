// @flow

import { Localized } from "fluent-react/compat";
import React from "react";

import { experimentL10nId } from "../../lib/utils";
import ExperimentTourDialog from "../ExperimentTourDialog";
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
  sendToGA: Function,
  navigateTo: Function
}

type FeaturedExperimentState = {
  showTourDialog: boolean
}

export default class FeaturedExperiment extends React.Component {
  props: FeaturedExperimentProps
  state: FeaturedExperimentState

  constructor(props: FeaturedExperimentProps) {
    super(props);
    this.state = {
      showTourDialog: false
    };
  }

  l10nId(pieces: string) {
    return experimentL10nId(this.props.experiment, pieces);
  }

  postInstallCallback() {
    this.setState({ showTourDialog: true });
  }

  onTourDialogComplete() {
    const { navigateTo, experiment } = this.props;
    const { slug } = experiment;
    this.setState({ showTourDialog: false });
    navigateTo(`/experiments/${slug}`);
  }

  render() {
    const { experiment, enabled } = this.props;
    const { showTourDialog } = this.state;
    const { description, title, subtitle, slug, video_url } = experiment;

    return (
      <div className="featured-experiment">
        <header className="featured-experiment__header">
          <div className={`experiment-icon-wrapper-${slug} experiment-icon-wrapper`}>
            <div className={`experiment-icon-${slug} experiment-icon`}></div>
          </div>
          <FeaturedStatus {...this.props} />
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
          <a className="featured-experiment__details" href={`/experiments/${slug}`}>Details</a>
        </Localized>}

        <div className="featured-experiment__actions">
          <FeaturedButton {...this.props} postInstallCallback={this.postInstallCallback.bind(this)} />
        </div>


        <div className="featured-experiment__video">
          <FeaturedStatus {...this.props} />
          <iframe
            width="100%"
            height="360"
            src={video_url}
            frameBorder="0"
            allowFullScreen />
        </div>

        {showTourDialog && <ExperimentTourDialog {...this.props}
                             onCancel={() => this.setState({ showTourDialog: false })}
                             onComplete={this.onTourDialogComplete.bind(this)}
        />}
      </div>
    );
  }
}
