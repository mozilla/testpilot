
import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import App from "./containers/App";
import ExperimentPage from "./containers/ExperimentPage";
import HomePage from "./containers/HomePage";
import HomePageWithAddon from "./containers/HomePage/HomePageWithAddon";


function appFactoryFor(Component) {
  return function appFactoryForComponent() {
    return <App>
      <Component />
    </App>;
  };
}

export function routes() {
  return <BrowserRouter>
    <div>
      <Route path="/" component={appFactoryFor(HomePage)} />
      <Route path="/experiments" component={appFactoryFor(HomePageWithAddon)} />
      <Route path="/experiment/:experimentname" component={appFactoryFor(ExperimentPage)} />
    </div>
  </BrowserRouter>;
}

