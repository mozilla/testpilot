// @flow

import React from 'react';

type WarningProps = {
  title: string,
  titleL10nId: string,
  titleL10nArgs: Array<string>,
  subtitle: string,
  subtitleL10nId: string,
  subtitleL10nArgs: Array<string>,
  children: Array<any>
}

export default class Warning extends React.Component {
  props: WarningProps

  renderSubtitle() {
    if (this.props.subtitle) {
      return (
        <p data-l10n-id={this.props.subtitleL10nId} data-l10n-args={this.props.subtitleL10nArgs}>{this.props.subtitle}</p>
      );
    }
    return null;
  }

  renderHeader() {
    if (this.props.title) {
      return (
        <header>
          <h3 data-l10n-id={this.props.titleL10nId} data-l10n-args={this.props.titleL10nArgs}>{this.props.title}</h3>
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
