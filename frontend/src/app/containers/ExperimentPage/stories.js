import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import LayoutWrapper from '../../components/LayoutWrapper';

import { experimentL10nId } from '../../lib/utils';

import IncompatibleAddons from './IncompatibleAddons';
import TestpilotPromo from './TestpilotPromo';
import DetailsOverview from './DetailsOverview';
import DetailsDescription, { EolBlock } from './DetailsDescription';

const layoutDecorator = story =>
  <div className="blue" style={{ padding: 10 }} onClick={action('click')}>
    <div className="stars" />
    <LayoutWrapper>
      {story()}
    </LayoutWrapper>
  </div>;

const detailsLayoutDecorator = story =>
  <div className="blue" style={{ padding: 10 }} onClick={action('click')}>
    <div className="stars" />
    <LayoutWrapper>
      <div className="default-background" style={{ padding: '40px' }}>
        <div id="details">
          <LayoutWrapper
            helperClass="details-content"
            flexModifier="details-content"
          >
            {story()}
          </LayoutWrapper>
        </div>
      </div>
    </LayoutWrapper>
  </div>;

const experiment = {
  slug: 'snooze-tabs',
  title: 'Sample experiment',
  description: 'This is an example experiment',
  subtitle: '',
  survey_url: 'https://example.com',
  created: '2010-06-21T12:12:12Z',
  modified: '2010-06-21T12:12:12Z',
  incompatible: {
    'foo@bar.com': 'Foo from BarCorp'
  },
  completed: null,
  thumbnail: '/static/images/check.png',
  changelog_url:
    'https://github.com/meandavejustice/min-vid/blob/master/CHANGELOG.md',
  contribute_url: 'https://github.com/meandavejustice/min-vid',
  bug_report_url: 'https://github.com/meandavejustice/min-vid/issues',
  discourse_url: 'https://discourse.mozilla-community.org/c/test-pilot/min-vid',
  privacy_notice_url:
    'https://github.com/meandavejustice/min-vid/blob/master/docs/metrics.md',
  details: [
    {
      image:
        '/static/images/experiments/min-vid/experiments_experimentdetail/detail1.jpg',
      copy: 'Access Min Vid from YouTube and Vimeo video players.\n'
    },
    {
      image:
        '/static/images/experiments/min-vid/experiments_experimentdetail/detail2.jpg',
      copy:
        'Watch video in the foreground while you do other things on the Web.\n'
    },
    {
      image:
        '/static/images/experiments/min-vid/experiments_experimentdetail/detail3.jpg',
      copy:
        'Right click on links to video to find Min Vid in the in-context controls.\n'
    }
  ],
  tour_steps: [
    {
      image:
        '/static/images/experiments/min-vid/experiments_experimenttourstep/tour1.jpg',
      copy: 'The first step (is the hardest)'
    },
    {
      image:
        '/static/images/experiments/min-vid/experiments_experimenttourstep/tour2.jpg',
      copy: 'The second step'
    },
    {
      image:
        '/static/images/experiments/min-vid/experiments_experimenttourstep/tour3.jpg',
      copy: 'The third step'
    },
    {
      image: '/static/images/experiments/shared/tour-final.jpg',
      copy: 'The final step'
    }
  ],
  contributors: [
    {
      display_name: 'Dave Justice',
      title: 'Engineer',
      avatar: '/static/images/experiments/min-vid/avatars/dave-justice.jpg'
    },
    {
      display_name: 'Jared Hirsch',
      title: 'Staff Engineer',
      avatar: '/static/images/experiments/min-vid/avatars/jared-hirsch.jpg'
    },
    {
      display_name: 'Jen Kagan',
      title: 'Engineering Intern',
      avatar: '/static/images/experiments/min-vid/avatars/jen-kagan.jpg'
    }
  ]
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

storiesOf('ExperimentPage/EolBlock', module)
  .addDecorator(layoutDecorator)
  .add('base state', () =>
    <EolBlock
      l10nId={pieces => experimentL10nId(experiment, pieces)}
      experiment={{
        ...experiment,
        completed: '2027-10-24T12:12:12Z',
        eol_warning:
          'This experiment is ending, but it will live on in our metrics.'
      }}
    />
  );

storiesOf('ExperimentPage/DetailsOverview', module)
  .addDecorator(detailsLayoutDecorator)
  .add('base state', () =>
    <DetailsOverview
      {...{
        experiment,
        graduated: false,
        highlightMeasurementPanel: false,
        showTour: action('showTour')
      }}
    />
  )
  .add('graduated', () =>
    <DetailsOverview
      {...{
        experiment: {
          ...experiment,
          completed: '2017-09-09T12:00:00Z'
        },
        graduated: true,
        highlightMeasurementPanel: false,
        showTour: action('showTour')
      }}
    />
  );

storiesOf('ExperimentPage/DetailsDescription', module)
  .addDecorator(detailsLayoutDecorator)
  .add('base state', () =>
    <DetailsDescription
      {...{
        experiment,
        graduated: false,
        locale: 'en-US',
        hasAddon: false,
        highlightMeasurementPanel: false,
        l10nId: id => id
      }}
    />
  )
  .add('locale warning', () =>
    <DetailsDescription
      {...{
        experiment: { ...experiment, locales: ['ar'] },
        graduated: false,
        locale: 'en-US',
        hasAddon: true,
        highlightMeasurementPanel: false,
        l10nId: id => id
      }}
    />
  )
  .add('graduate soon', () =>
    <DetailsDescription
      {...{
        experiment: {
          ...experiment,
          eol_warning:
            'This experiment is ending, but it will live on in our hearts.',
          graduation_url: 'https://mozilla.org/',
          completed: '2017-09-09T12:00:00Z'
        },
        graduated: false,
        locale: 'en-US',
        hasAddon: false,
        highlightMeasurementPanel: false,
        l10nId: id => id
      }}
    />
  )
  .add('graduated', () =>
    <DetailsDescription
      {...{
        experiment: {
          ...experiment,
          graduation_url: 'https://mozilla.org/',
          completed: '2017-09-09T12:00:00Z'
        },
        graduated: true,
        locale: 'en-US',
        hasAddon: false,
        highlightMeasurementPanel: false,
        l10nId: id => id
      }}
    />
  );
