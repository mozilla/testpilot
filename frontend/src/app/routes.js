
import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import App from "./containers/App";
import ExperimentPage from "./containers/ExperimentPage";
import HomePage from "./containers/HomePage";
import HomePageWithAddon from "./containers/HomePage/HomePageWithAddon";


function appFactoryFor(Component) {
  return function appFactoryForComponent(_props) {
    // The react-router match information is available as props here if needed.
    return <App>
      <Component />
    </App>;
  };
}

export function routes() {
  return <BrowserRouter>
    <div>
      <Route exact path="/" component={appFactoryFor(HomePage)} />
      <Route exact path="/experiments" component={appFactoryFor(HomePageWithAddon)} />
      <Route path="/experiments/:experimentname" component={appFactoryFor(ExperimentPage)} />
    </div>
  </BrowserRouter>;
}

