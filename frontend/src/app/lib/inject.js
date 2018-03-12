import React from "react";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router";
import App from "../containers/App";
import store from "../store";

export default function inject(name, component, callback) {
  const s = store();
  if (callback !== undefined) {
    callback(s);
  }
  const context = {};
  const provider = <Provider store={ s }>
    <StaticRouter context={context}>
      <App>{ component }</App>
    </StaticRouter>
  </Provider>;

  return provider;
}
