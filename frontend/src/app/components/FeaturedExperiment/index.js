// @flow

import { Localized } from 'fluent-react/compat';
import React from 'react';

import { experimentL10nId } from '../../lib/utils';
import ExperimentTourDialog from '../ExperimentTourDialog';
import FeaturedStatus from './FeaturedStatus';
import FeaturedButton from './FeaturedButton';

import './index.scss';

import type { InstalledExperiments } from '../../reducers/addon';

import ExperimentPlatforms from '../ExperimentPlatforms';

type FeaturedExperimentProps = {
  experiment: Object,
  hasAddon: any,
  enabled: Boolean,
  isFirefox: Boolean,
  isMinFirefox: Boolean,
  installed: InstalledExperiments,
  clientUUID: ?string,
  eventCategory: string,
  getExperimentLastSeen: Function,
  sendToGA: Function,
  navigateTo: Function
}

type FeaturedExperimentState = {
  shouldShowTourDialog: boolean,
  showTourDialog: boolean
}

export default class FeaturedExperiment extends React.Component {
  props: FeaturedExperimentProps
  state: FeaturedExperimentState

  constructor(props: HomePageWithAddonProps) {
    super(props);
    this.state = {
      shouldShowTourDialog: false,
      showTourDialog: false
    };
  }

  componentWillReceiveProps(nextProps: FeaturedExperimentProps, prevProps: FeaturedExperimentProps) {
    const { shouldShowTourDialog } = this.state;

    // this.setState({ shouldShowTourDialog: true });

    // On enable state change, stop installation indicators & show tour dialog if needed.
    if (nextProps.enabled !== prevProps.enabled) {
      const showTourDialog = shouldShowTourDialog && nextProps.enabled;
      this.setState({
        shouldShowTourDialog: false,
        showTourDialog
      });
    }
  }

  l10nId(pieces: string) {
    return experimentL10nId(this.props.experiment, pieces);
  }

  render() {
    const { experiment, enabled } = this.props;
    const { showTourDialog } = this.state;
    const { description, title, subtitle, slug, video_url } = experiment;

    return (
      <div className="featured-experiment">
        <div className="featured-information">
          <header>
            <div className="icon-wrap">
              <div className={`experiment-icon-${slug} experiment-icon`}></div>
            </div>
            <div className="title-wrap">
              <h2>{title}</h2>
              <div className="featured-info-line">
                <ExperimentPlatforms experiment={experiment} />
                {subtitle && <Localized id={this.l10nId('subtitle')}>
                  <h4 className="subtitle">{subtitle}</h4>
                </Localized>}
              </div>
            </div>
          </header>

          <Localized id={this.l10nId('description')}>
            <p className="featured-description">{description}</p>
          </Localized>

          {!enabled && <Localized id='moreDetail'>
            <a href={`/experiments/${slug}`}>More Detail</a>
          </Localized>}

          <div className="featured-actions">
            <FeaturedButton {...this.props} />
          </div>
        </div>

        <div className="featured-video">
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
                             onComplete={() => this.setState({ showTourDialog: false })}
        />}
      </div>
    );
  }
}
