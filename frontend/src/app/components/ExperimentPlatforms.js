
import React from 'react';

const AVAILABLE_PLATFORMS = ['web', 'addon', 'mobile'];

export default function ExperimentPlatforms({ experiment }) {
  const platforms = experiment.platforms || [];
  const enabledPlatforms = AVAILABLE_PLATFORMS
    .filter(platform => platforms.indexOf(platform) !== -1);
  if (enabledPlatforms.length === 0) { return null; }

  const l10nId = 'experimentPlatform' + enabledPlatforms
    .map(platform => platform.charAt(0).toUpperCase() + platform.slice(1))
    .join('');

  return (
    <h4 className="experiment-platform">
      {enabledPlatforms.map(platform =>
        <span key={platform} className={'platform-icon platform-icon-' + platform}>&nbsp;</span>)}
      <span data-l10n-id={l10nId}>
        Available on {enabledPlatforms.join(' / ')}
      </span>
    </h4>
  );
}
