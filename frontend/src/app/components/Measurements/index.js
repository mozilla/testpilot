// @flow

import React from "react";
import classnames from "classnames";
import { Localized } from "fluent-react/compat";

type MeasurementsSectionType = {
  experiment: Object,
  highlightMeasurementPanel: boolean,
  l10nId: Function
};

const EXPERIMENT_MEASUREMENT_URLS = [
  null,
  null,
  null,
  "https://www.mozilla.org/privacy/websites"
];

export default function MeasurementsSection({
  experiment: { title, privacy_preamble, privacy_notice_url, measurements },
  highlightMeasurementPanel,
  l10nId
}: MeasurementsSectionType) {
  return (
    <section
      className={classnames("measurements", {
        highlight: highlightMeasurementPanel
      })}
    >
      <Localized id="measurements">
        <h3>Your privacy</h3>
      </Localized>
      <div data-hook="measurements-html" className="measurement">
        {privacy_preamble &&
          <Localized id={l10nId("privacy_preamble")}>
            <p>
              {privacy_preamble}
            </p>
          </Localized>}
        {measurements &&
        <div>
          <Localized
            id="experimentMeasurementIntro"
            $experimentTitle={title}
            a={<a target="_blank" rel="noopener noreferrer" href="/privacy" />}>
            <p>
              In addition to the <a>data</a> collected by all Test Pilot
              experiments, here are the key things you should know about what is
              happening when you use {title}:
            </p>
          </Localized>

          <ul>
            {measurements.map((note, idx) =>
              <Localized key={idx} id={l10nId(["measurements", idx])}
                a={EXPERIMENT_MEASUREMENT_URLS[idx] === null
                  ? null
                  : <a href={EXPERIMENT_MEASUREMENT_URLS[idx]} />}>
                <li></li>
              </Localized>
            )}
          </ul>
        </div>}
      </div>
      {privacy_notice_url &&
        <Localized id="experimentPrivacyNotice" $title={title}>
          <a className="privacy-policy" href={privacy_notice_url}>
            You can learn more about the data collection for {title} here.
          </a>
        </Localized>}
    </section>
  );
}
