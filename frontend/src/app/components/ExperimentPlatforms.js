
import React from 'react';

import { Localized } from 'fluent-react/compat';

const AVAILABLE_PLATFORMS = ['web', 'addon', 'mobile'];

export default function ExperimentPlatforms({ experiment }) {
  const platforms = experiment.platforms || [];
  const enabledPlatforms = AVAILABLE_PLATFORMS
    .filter(platform => platforms.indexOf(platform) !== -1);
  if (enabledPlatforms.length === 0) { return null; }

  let l10nId = 'experimentPlatform' + enabledPlatforms
    .map(platform => platform.charAt(0).toUpperCase() + platform.slice(1))
    .join('');

  if (l10nId === 'experimentPlatformMobile') {
    // HACK: string changed after initial commit, so the ID had to change
    l10nId = 'experimentPlatformMobileApp';
  }

  return (
    <h4 className="experiment-platform">
      {enabledPlatforms.map(platform =>
        <span key={platform} className={'platform-icon platform-icon-' + platform}>&nbsp;</span>)}
      <Localized id={ l10nId }>
        <span className='platform-copy'>
          Available on { enabledPlatforms.join(' / ') }
        </span>
      </Localized>
    </h4>
  );
}
