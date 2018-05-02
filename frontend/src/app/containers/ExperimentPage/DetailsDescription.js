// @flow

import React from "react";
import parser from "html-react-parser";
import { Localized } from "fluent-react/compat";
import LocalizedHtml from "../../components/LocalizedHtml";

import Warning from "../../components/Warning";
import { experimentL10nId, formatDate } from "../../lib/utils";

import GraduatedNotice from "../../components/GraduatedNotice";
import IncompatibleAddons from "./IncompatibleAddons";
import MeasurementsSection from "../../components/Measurements";

import type {
  DetailsDescriptionProps,
  LocaleWarningType,
  EolBlockProps
} from "./types";

export default function DetailsDescription({
  experiment,
  graduated,
  locale,
  hasAddon,
  installedAddons,
  highlightMeasurementPanel
}: DetailsDescriptionProps) {
  const {
    introduction,
    warning,
    details,
    video_url,
    graduation_url,
    completed
  } = experiment;

  const l10nId = pieces => experimentL10nId(experiment, pieces);

  return (
    <div className="details-description">
      {completed && !graduated && <EolBlock {...{ experiment, l10nId }} />}
      <IncompatibleAddons {...{ experiment, installedAddons }} />
      {!graduated && <LocaleWarning {...{ experiment, locale, hasAddon }} />}
      {graduated && <GraduatedNotice {...{ graduated, graduation_url }} />}

      {video_url &&
        <iframe
          key={video_url} // see issue #3469
          width="100%"
          height="360"
          src={video_url}
          frameBorder="0"
          allowFullScreen
          className="experiment-video"
        />}
      <div>
        {!!introduction &&
          <section className="introduction">
            {!!warning &&
              <div className="warning">
                <Localized id={l10nId("warning")}>
                  <strong>
                    {warning}
                  </strong>
                </Localized>
              </div>}
            <LocalizedHtml id={l10nId("introduction")}>
              <div>
                {parser(introduction)}
              </div>
            </LocalizedHtml>
          </section>}
      </div>
      <div className="details-list">
        {details.map(({ image, copy, headline }, idx) =>
          <div key={idx}>
            <div className="details-image">
              <img width="680" src={image} />
              <p className="caption">
                {headline &&
                  <Localized id={l10nId(["details", idx, "headline"])}>
                    <strong>
                      {headline}
                    </strong>
                  </Localized>}
                {copy &&
                  <Localized id={l10nId(["details", idx, "copy"])}>
                    <span>
                      {parser(copy)}
                    </span>
                  </Localized>}
              </p>
            </div>
          </div>
        )}
      </div>
      {!graduated &&
          <MeasurementsSection
            {...{ experiment, highlightMeasurementPanel, l10nId }}
          />}
    </div>
  );
}

export const LocaleWarning = ({
  experiment,
  locale,
  hasAddon
}: LocaleWarningType) => {
  const { locales, locale_blocklist } = experiment;
  if (
    hasAddon !== null &&
    locale &&
    ((locales && !locales.includes(locale)) ||
      (locale_blocklist && locale_blocklist.includes(locale)))
  ) {
    return (
      <Warning
        titleL10nId="localeNotTranslatedWarningTitle"
        titleL10nArgs={JSON.stringify({ locale_code: locale })}
        title="This experiment has not been translated to your language (en)."
        subtitleL10nId="localeWarningSubtitle"
        subtitle="You can still enable it if you like."
      />
    );
  }
  return null;
};

export const EolBlock = ({ experiment, l10nId }: EolBlockProps) => {
  const completedDate = formatDate(experiment.completed);
  const title = `${experiment.title} is ending on ${completedDate}`;

  return (
    <Warning
      titleL10nId="eolIntroMessage"
      titleL10nArgs={JSON.stringify({ title: experiment.title, completedDate })}
      title={title}
    >
      <Localized id={l10nId("eolWarning")}>
        <div>
          {parser(experiment.eol_warning)}
        </div>
      </Localized>
      <div className="small-spacer" />
      <Localized id="eolNoticeLink">
        <a href="/about" target="_blank" rel="noopener noreferrer">
          Learn more
        </a>
      </Localized>
    </Warning>
  );
};
