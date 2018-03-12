import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { setupAddonConnection } from "./InstallManager";
import { routes } from "../routes";
import store from "../store";
import App from "../containers/App";

export default function inject(name, component, callback) {
  const s = store();
  if (callback !== undefined) {
    callback(s);
  }

  if (typeof document !== "undefined") {
    setupAddonConnection(s);
    if (document.body !== null) {
      let node = document.getElementById("page-container");
      if (node !== null) {
        node.remove();
      }

      node = document.createElement("div");
      node.id = "page-container";
      document.body.appendChild(node);

      ReactDOM.render(<Provider store={ s }>
        { routes() }
      </Provider>, node);
    }
  }
  return <Provider store={ s }>
    <App>{ component }</App>
  </Provider>;
}
