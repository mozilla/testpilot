
import React from "react";

import HomePageNoAddon from "./HomePageNoAddon";
import HomePageWithAddon from "./HomePageWithAddon";

import "./index.scss";

export default class HomePage extends React.Component {
  render() {
    if (this.props.hasAddon) {
      return <HomePageWithAddon {...this.props} />;
    }
    return <HomePageNoAddon {...this.props} />;
  }
}
