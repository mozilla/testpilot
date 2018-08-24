// @flow
import { Localized } from "fluent-react/compat";
import React, { Component } from "react";

import "./index.scss";

type WarningProps = {
  title: string,
  titleL10nId: string,
  titleL10nArgs?: Object,
  subtitle?: string,
  subtitleL10nId?: string,
  subtitleL10nArgs?: Object,
  children?: Array<any>
}

export default class Warning extends Component<WarningProps> {

  renderSubtitle() {
    if (this.props.subtitle) {
      return (
        <Localized id={this.props.subtitleL10nId} {...this.props.subtitleL10nArgs}>
          <p>{this.props.subtitle}</p>
        </Localized>
      );
    }
    return null;
  }

  renderHeader() {
    if (this.props.title) {
      return (
        <header>
          <Localized id={this.props.titleL10nId} {...this.props.titleL10nArgs}>
            <h3>{this.props.title}</h3>
          </Localized>
          {this.renderSubtitle()}
        </header>
      );
    }
    return null;
  }

  renderChildren() {
    if (this.props.children) {
      return (
        <main>
          { this.props.children }
        </main>
      );
    }
    return null;
  }

  render() {
    return (
      <section className="warning">
        {this.renderHeader()}
        {this.renderChildren()}
      </section>
    );
  }
}
