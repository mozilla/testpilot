import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';

import PhotonColors from 'photon-colors';
import UpdateList from './index';
import LayoutWrapper from '../LayoutWrapper';

const time = Date.now();

// quick & dirty utility to make canned news updates
const mkupdate = (daysAgo, slug, experimentSlug, title, content, rest) => {
  const dt = time - (daysAgo * 24 * 60 * 60 * 1000);
  return Object.assign(
    {
      slug,
      experimentSlug,
      title,
      content,
      created: new Date(dt - 1000).toISOString(),
      published: new Date(dt).toISOString()
    },
    rest || {}
  );
};

const baseProps = {
  sendToGA: action('sendToGA'),
  experiments: [
    { slug: 'dev-example', title: 'Dev Example' },
    { slug: 'min-vid', title: 'Min Vid' },
    { slug: 'snooze-tabs', title: 'Snooze Tabs' },
    { slug: 'containers', title: 'Containers' }
  ],
  freshNewsUpdates: [
    mkupdate(
      1,
      'story-123',
      null,
      'Example Update #1',
      'This is an example update'
    ),
    mkupdate(
      2,
      'story-999',
      null,
      'Blog Post #1',
      'This is an example update with a blog post link',
      { link: 'https://medium.com/firefox-test-pilot' }
    ),
    mkupdate(
      3,
      'story-456',
      'dev-example',
      'Example Update #2',
      'This is another example update'
    )
  ]
};

const basePropsWithStaleNews = Object.assign({}, baseProps, {
  staleNewsUpdates: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(idx =>
    mkupdate(
      15 + idx,
      `stale-${idx}`,
      [null, 'dev-example', 'snooze-tabs', 'min-vid', 'containers'][idx % 5],
      `Stale update #${idx}`,
      `This is an older update, #${idx}`
    )
  )
});

storiesOf('UpdateList', module)
  .addDecorator(withKnobs)
  .addDecorator(story =>
    <div className="blue" style={{
      padding: 10,
      // TODO: Replace this with a proper background class that's been photonized
      background: `linear-gradient(-180deg, ${PhotonColors.BLUE_90} 0%, ${PhotonColors.PURPLE_90} 100%, ${PhotonColors.BLUE_90} 100%)`
    }} onClick={action('click')}>
      <LayoutWrapper flexModifier="card-list">
        {story()}
      </LayoutWrapper>
    </div>
  )
  .add('no stale news', () => <UpdateList {...baseProps} />)
  .add('stale news available', () =>
    <UpdateList {...{ ...basePropsWithStaleNews }} />
  )
  .add('stale news shown', () =>
    <UpdateList {...{ ...basePropsWithStaleNews, initialShowMoreNews: true }} />
  )
  .add('no fresh news', () =>
    <UpdateList {...{ ...basePropsWithStaleNews, freshNewsUpdates: [] }} />
  )
  .add('no news at all', () =>
    <UpdateList {...{ ...baseProps, freshNewsUpdates: [] }} />
  );
