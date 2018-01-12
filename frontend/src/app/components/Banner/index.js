// @flow

import React from "react";
import classnames from "classnames";

import "./index.scss";

type BannerProps = {
  background?: boolean,
  condensed?: boolean,
  dataL10nId?: string,
  children?: Array<any>
}

export default class Banner extends React.Component {
  props: BannerProps

  render() {
    const { children, condensed = false, background = false } = this.props;
    return <div className={classnames("banner", {
      "banner--condensed": condensed,
      "banner--expanded": !condensed,
      "banner--background": background
    })}>
      { children }
    </div>;
  }
}
