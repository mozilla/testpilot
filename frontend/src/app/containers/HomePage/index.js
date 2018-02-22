
import React from "react";

import HomePageNoAddon from "./HomePageNoAddon";
import HomePageWithAddon from "./HomePageWithAddon";

import "./index.scss";

export default class HomePage extends React.Component {
  render() {
    const {
      hasAddon,
      replaceState,
      getCookie
    } = this.props;

    if (hasAddon === null) {
      // If we are rendering the / page on the server, assume the addon is not installed.
      return <HomePageNoAddon {...this.props} />;
    }
    if (getCookie("visit-count") === undefined && hasAddon) {
      replaceState({}, "", "/experiments");
      return <HomePageWithAddon {...this.props} />;
    }
    return <HomePageNoAddon {...this.props} />;
  }
}
