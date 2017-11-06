// @flow

import React from 'react';
import classnames from 'classnames';
import { Localized } from 'fluent-react/compat';
import LocalizedHtml from '../../components/LocalizedHtml';
import { experimentL10nId, formatDate } from '../../lib/utils';

import type {
  DetailsOverviewType,
  LaunchStatusType,
  StatsSectionType,
  ContributorsSectionType,
  MeasurementsSectionType
} from './types';

export default function DetailsOverview({
  experiment,
  graduated,
  highlightMeasurementPanel,
  doShowTourDialog
}: DetailsOverviewType) {
  const { slug, thumbnail, measurements } = experiment;
  const l10nId = (pieces: string) => experimentL10nId(experiment, pieces);

  return (
    <div className="details-overview">
      <div
        className={`experiment-icon-wrapper-${slug} experiment-icon-wrapper`}
      >
        <img className="experiment-icon" src={thumbnail} />
      </div>
      <div className="details-sections">
        <section className="user-count">
          <LaunchStatus {...{ experiment, graduated }} />
        </section>
        {!graduated && <StatsSection {...{ experiment, doShowTourDialog }} />}
        <ContributorsSection {...{ experiment, l10nId }} />
        {!graduated &&
          measurements &&
          <MeasurementsSection
            {...{ experiment, highlightMeasurementPanel, l10nId }}
          />}
      </div>
    </div>
  );
}

export const LaunchStatus = ({ experiment, graduated }: LaunchStatusType) => {
  const { created, completed } = experiment;

  const completedDate = formatDate(completed);
  if (graduated) {
    return (
      <LocalizedHtml id="completedDateLabel" $completedDate={completedDate}>
        <span>
          Experiment End Date: <b>{completedDate}</b>
        </span>
      </LocalizedHtml>
    );
  }

  const startedDate = formatDate(created);
  return (
    <LocalizedHtml id="startedDateLabel" $startedDate={startedDate}>
      <span>
        Experiment Start Date: <b>{startedDate}</b>
      </span>
    </LocalizedHtml>
  );
};

export const StatsSection = ({
  doShowTourDialog,
  experiment: {
    title,
    web_url,
    changelog_url,
    contribute_url,
    bug_report_url,
    discourse_url
  }
}: StatsSectionType) =>
  <div>
    <section className="stats-section">
      {!web_url &&
        <p>
          <Localized id="tourLink">
            <a className="showTour" onClick={doShowTourDialog} href="#">
              Launch Tour
            </a>
          </Localized>
        </p>}
      <dl>
        {changelog_url &&
          <Localized id="changelog">
            <dt>Changelog</dt>
          </Localized>}
        {changelog_url &&
          <dd>
            <a href={changelog_url}>
              {changelog_url}
            </a>
          </dd>}
        <Localized id="contribute">
          <dt>Contribute</dt>
        </Localized>
        <dd>
          <a href={contribute_url}>
            {contribute_url}
          </a>
        </dd>

        <Localized id="bugReports">
          <dt>Bug Reports</dt>
        </Localized>
        <dd>
          <a href={bug_report_url}>
            {bug_report_url}
          </a>
        </dd>

        <Localized id="discussExperiment" $title={title}>
          <dt>
            Discuss {title}
          </dt>
        </Localized>
        <dd>
          <a href={discourse_url}>
            {discourse_url}
          </a>
        </dd>
      </dl>
    </section>
  </div>;

export const ContributorsSection = ({
  experiment: { contributors, contributors_extra, contributors_extra_url },
  l10nId
}: ContributorsSectionType) =>
  <section className="contributors-section">
    <Localized id="contributorsHeading">
      <h3>Brought to you by</h3>
    </Localized>
    <ul className="contributors">
      {contributors.map((contributor, idx) =>
        <li key={idx}>
          <img
            className="avatar"
            width="56"
            height="56"
            src={contributor.avatar}
          />
          <div className="contributor">
            <p className="name">
              {contributor.display_name}
            </p>
            {contributor.title &&
              <Localized id={l10nId(['contributors', idx, 'title'])}>
                <p className="title">
                  {contributor.title}
                </p>
              </Localized>}
          </div>
        </li>
      )}
    </ul>
    {contributors_extra &&
      <p className="disclaimer">
        <Localized id={l10nId('contributors_extra')}>
          <span>
            {contributors_extra}
          </span>
        </Localized>
        {contributors_extra_url &&
          <span>
            &nbsp;
            <Localized id="contributorsExtraLearnMore">
              <a
                href={contributors_extra_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more
              </a>
            </Localized>
            .
          </span>}
      </p>}
  </section>;

const EXPERIMENT_MEASUREMENT_URLS = [
  null,
  null,
  null,
  'https://www.mozilla.org/privacy/websites'
];

export const MeasurementsSection = ({
  experiment: { title, privacy_preamble, privacy_notice_url, measurements },
  highlightMeasurementPanel,
  l10nId
}: MeasurementsSectionType) => {
  const privacy = (
    <Localized id="experimentMeasurementIntroPrivacyLink">
      <a target="_blank" rel="noopener noreferrer" href="/privacy" />
    </Localized>
  );

  return (
    <section
      className={classnames('measurements', {
        highlight: highlightMeasurementPanel
      })}
    >
      <Localized id="measurements">
        <h3>Your privacy</h3>
      </Localized>
      <div data-hook="measurements-html" className="measurement">
        {privacy_preamble &&
          <Localized id={l10nId('privacy_preamble')}>
            <p>
              {privacy_preamble}
            </p>
          </Localized>}
        <LocalizedHtml
          id="experimentMeasurementIntro"
          $experimentTitle={title}
          $privacy={privacy}
        >
          <p>
            In addition to the {privacy} collected by all Test Pilot
            experiments, here are the key things you should know about what is
            happening when you use {title}:
          </p>
        </LocalizedHtml>
        <ul>
          {measurements.map((note, idx) =>
            <LocalizedHtml key={idx} id={l10nId(['measurements', idx])}>
              <li>
                {EXPERIMENT_MEASUREMENT_URLS[idx] === null
                  ? null
                  : <a href={EXPERIMENT_MEASUREMENT_URLS[idx]} />}
              </li>
            </LocalizedHtml>
          )}
        </ul>
      </div>
      {privacy_notice_url &&
        <Localized id="experimentPrivacyNotice" $title={title}>
          <a className="privacy-policy" href={privacy_notice_url}>
            You can learn more about the data collection for {title} here.
          </a>
        </Localized>}
    </section>
  );
};
