import React from 'react';

import HomePageNoAddon from './HomePageNoAddon';
import HomePageWithAddon from './HomePageWithAddon';

import Loading from '../components/Loading';

export default class HomePage extends React.Component {
  render() {
    if (this.props.hasAddon === null) {
      return <Loading {...this.props} />;
    } else if (this.props.hasAddon) {
      return <HomePageWithAddon {...this.props} />;
    }
    return <HomePageNoAddon {...this.props} />;
  }
}

HomePage.propTypes = {
  hasAddon: React.PropTypes.bool
};
