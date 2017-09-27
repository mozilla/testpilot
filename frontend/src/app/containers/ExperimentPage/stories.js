import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import LayoutWrapper from '../../components/LayoutWrapper';

import IncompatibleAddons from './IncompatibleAddons';
import TestpilotPromo from './TestpilotPromo';

const layoutDecorator = story =>
  <div className="blue" style={{ padding: 10 }} onClick={action('click')}>
    <div className="stars" />
    <LayoutWrapper>
      {story()}
    </LayoutWrapper>
  </div>;

const experiment = {
  title: 'Sample experiment',
  description: 'This is an example experiment',
  subtitle: '',
  slug: 'snooze-tabs',
  survey_url: 'https://example.com',
  created: '2010-06-21T12:12:12Z',
  modified: '2010-06-21T12:12:12Z',
  incompatible: {
    'foo@bar.com': 'Foo from BarCorp'
  }
};

const installedAddons = ['foo@bar.com'];

const incompatibleAddonBaseProps = {
  experiment,
  installedAddons
};

storiesOf('ExperimentPage/IncompatibleAddons', module)
  .addDecorator(layoutDecorator)
  .add('base state', () =>
    <IncompatibleAddons {...incompatibleAddonBaseProps} />
  )
  .add('none installed', () =>
    <IncompatibleAddons
      {...{ ...incompatibleAddonBaseProps, installedAddons: [] }}
    />
  );

const testpilotPromoBaseProps = {
  experiment,
  isFirefox: false,
  isMinFirefox: false,
  graduated: false,
  hasAddon: false,
  varianttests: {},
  installExperiment: action('installExperiment')
};

storiesOf('ExperimentPage/TestpilotPromo', module)
  .addDecorator(layoutDecorator)
  .add('base state', () => <TestpilotPromo {...testpilotPromoBaseProps} />)
  .add('is firefox', () =>
    <TestpilotPromo {...{ ...testpilotPromoBaseProps, isFirefox: true }} />
  )
  .add('is min firefox', () =>
    <TestpilotPromo
      {...{ ...testpilotPromoBaseProps, isFirefox: true, isMinFirefox: true }}
    />
  )
  .add('has add-on', () =>
    <TestpilotPromo {...{ ...testpilotPromoBaseProps, hasAddon: true }} />
  );
