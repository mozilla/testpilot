// @flow
import React from "react";

import { Localized } from "fluent-react/compat";

import "./index.scss";

const AVAILABLE_PLATFORMS: Array<string> = ["web", "addon", "ios", "android"];

export default function ExperimentPlatforms({ experiment }: { experiment: { platforms: Array<string>}}) {
  let enabledPlatforms: Array<string> = AVAILABLE_PLATFORMS
    .filter((platform: string) => experiment.platforms.includes(platform));
  if (enabledPlatforms.length === 0) { return null; }

  // sort list so that l10n ids are consistent regardless of array order in YAML
  enabledPlatforms.sort();

  let l10nId: string = "experimentPlatform" + enabledPlatforms
    .map((platform: string) => platform.charAt(0).toUpperCase() + platform.slice(1))
    .join("");

  return (
    <h4 className="experiment-platform">
      {enabledPlatforms.map((platform: string) =>
        <span key={platform} className={"platform-icon platform-icon-" + platform}>&nbsp;</span>)}
      <Localized id={ l10nId }>
        <span className='platform-copy'>
          Available on { enabledPlatforms.join(" / ") }
        </span>
      </Localized>
    </h4>
  );
}
