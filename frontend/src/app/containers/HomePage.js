
import React from 'react';

import HomePageNoAddon from './HomePageNoAddon';
import HomePageWithAddon from './HomePageWithAddon';

export default class HomePage extends React.Component {
  render() {
    if (this.props.hasAddon) {
      window.history.replaceState({}, '', '/experiments');
      return <HomePageWithAddon {...this.props} />;
    }
    return <HomePageNoAddon {...this.props} />;
  }
}
