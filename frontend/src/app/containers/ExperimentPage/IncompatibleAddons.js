// @flow
import React from "react";
import { Localized } from "fluent-react/compat";
import LocalizedHtml from "../../components/LocalizedHtml";

import "./index.scss";

import type { IncompatibleAddonsProps } from "./types";

export default class IncompatibleAddons extends React.Component {
  props: IncompatibleAddonsProps

  render() {
    const { incompatible } = this.props.experiment;
    const installed = this.getIncompatibleInstalled(incompatible);
    if (installed.length === 0) return null;

    const helpUrl = "https://support.mozilla.org/kb/disable-or-remove-add-ons";

    return (
      <section className="incompatible-addons">
        <header>
          <Localized id="incompatibleHeader">
            <h3>
              This experiment may not be compatible with add-ons you have installed.
            </h3>
          </Localized>
          <LocalizedHtml id="incompatibleSubheader">
            <p>
              We recommend <a href={helpUrl}>disabling these add-ons</a> before activating this experiment:
            </p>
          </LocalizedHtml>
        </header>
        <main>
          <ul>
            {installed.map(guid => (
              <li key={guid}>{incompatible[guid]}</li>
            ))}
          </ul>
        </main>
      </section>
    );
  }

  getIncompatibleInstalled(incompatible: Object) {
    if (!incompatible) {
      return [];
    }
    const installed = this.props.installedAddons || [];
    return Object.keys(incompatible).filter(guid => (
      installed.indexOf(guid) !== -1
    ));
  }

}
