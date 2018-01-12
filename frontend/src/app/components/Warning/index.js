// @flow
import { Localized } from "fluent-react/compat";
import React from "react";

import "./index.scss";

type WarningProps = {
  title: string,
  titleL10nId: string,
  titleL10nArgs: string,
  subtitle?: string,
  subtitleL10nId?: string,
  subtitleL10nArgs?: string,
  children?: Array<any>
}

export default class Warning extends React.Component {
  props: WarningProps

  renderSubtitle() {
    if (this.props.subtitle) {
      const parsed = this.props.subtitleL10nArgs ? JSON.parse(this.props.subtitleL10nArgs) : {};
      const args = {};
      Object.keys(parsed).map(key => {
        return args[`$${key}`] = parsed[key];
      });
      return (
        <Localized id={this.props.subtitleL10nId} {...args}>
          <p>{this.props.subtitle}</p>
        </Localized>
      );
    }
    return null;
  }

  renderHeader() {
    if (this.props.title) {
      const parsed = this.props.titleL10nArgs ? JSON.parse(this.props.titleL10nArgs) : {};
      const args = {};
      Object.keys(parsed).map(key => {
        return args[`$${key}`] = parsed[key];
      });
      return (
        <header>
          <Localized id={this.props.titleL10nId} {...args}>
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
