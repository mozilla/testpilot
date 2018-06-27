// @flow

import React from "react";
import classnames from "classnames";
import { Localized } from "fluent-react/compat";
import LocalizedHtml from "../../components/LocalizedHtml";

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
  const privacy = (
    <Localized id="experimentMeasurementIntroPrivacyLink">
      <a target="_blank" rel="noopener noreferrer" href="/privacy" />
    </Localized>
  );

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
              <LocalizedHtml key={idx} id={l10nId(["measurements", idx])}>
                <li>
                  {EXPERIMENT_MEASUREMENT_URLS[idx] === null
                    ? null
                    : <a href={EXPERIMENT_MEASUREMENT_URLS[idx]} />}
                </li>
              </LocalizedHtml>
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
