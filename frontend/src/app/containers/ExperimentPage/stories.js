import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import IncompatibleAddons from './IncompatibleAddons';
import LayoutWrapper from '../../components/LayoutWrapper';

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

const installedAddons = [
  'foo@bar.com'
];

const baseProps = {
  experiment,
  installedAddons
};

storiesOf('IncompatibleAddons', module)
  .addDecorator(story =>
    <div className="blue" style={{ padding: 10 }} onClick={action('click')}>
      <div className="stars" />
      <LayoutWrapper flexModifier="card-list">
        {story()}
      </LayoutWrapper>
    </div>
  )
  .add('base state', () =>
    <IncompatibleAddons {...baseProps} />
  )
  .add('none installed', () =>
    <IncompatibleAddons {...{ ...baseProps, installedAddons: [] }} />
  )
  ;
