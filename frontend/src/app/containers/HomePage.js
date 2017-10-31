
import React from 'react';

import HomePageNoAddon from './HomePageNoAddon';
import HomePageWithAddon from './HomePageWithAddon';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldRedirectToExperiments: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const prevHasAddon = this.props.hasAddon;
    const nextHasAddon = nextProps.hasAddon;
    if (prevHasAddon !== nextHasAddon && nextHasAddon === true) {
      this.setState({ shouldRedirectToExperiments: true });
    }
  }

  render() {
    if (this.state.shouldRedirectToExperiments) {
      this.props.replaceState({}, '', '/experiments');
      this.setState({ shouldRedirectToExperiments: false });
      return <HomePageWithAddon {...this.props} />;
    }
    return <HomePageNoAddon {...this.props} />;
  }
}
