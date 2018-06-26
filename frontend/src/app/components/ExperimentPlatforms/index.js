import React from "react";

import { Localized } from "fluent-react/compat";

import "./index.scss";

const AVAILABLE_PLATFORMS = ["web", "addon", "ios", "android"];

export default function ExperimentPlatforms({ experiment }) {
  let enabledPlatforms = AVAILABLE_PLATFORMS
    .filter(platform => experiment.platforms.includes(platform));
  if (enabledPlatforms.length === 0) { return null; }

  // sort list so that l10n ids are consistent regardless of array order in YAML
  enabledPlatforms.sort();

  let l10nId = "experimentPlatform" + enabledPlatforms
    .map(platform => platform.charAt(0).toUpperCase() + platform.slice(1))
    .join("");

  return (
    <h4 className="experiment-platform">
      {enabledPlatforms.map(platform =>
        <span key={platform} className={"platform-icon platform-icon-" + platform}>&nbsp;</span>)}
      <Localized id={ l10nId }>
        <span className='platform-copy'>
          Available on { enabledPlatforms.join(" / ") }
        </span>
      </Localized>
    </h4>
  );
}
