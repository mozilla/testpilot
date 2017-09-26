import React from 'react';
import { storiesOf } from '@storybook/react';

import GraduatedNotice from './index';


storiesOf('GraduatedNotice', module)
  .add('base state', () =>
    <GraduatedNotice />
  )
  .add('with graduation url', () =>
    <GraduatedNotice
      graduation_url="https://medium.com/firefox-test-pilot"
    />
  );
