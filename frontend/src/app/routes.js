
import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import HomePage from "./containers/HomePage";
import HomePageWithAddon from "./containers/HomePage/HomePageWithAddon";
import ExperimentPage from "./containers/ExperimentPage";


export function routes() {
  return <BrowserRouter>
    <div>
      <Route path="/" component={HomePage} />
      <Route path="/experiments" component={HomePageWithAddon} />
      <Route path="/experiment/:experimentname" component={ExperimentPage} />
    </div>
  </BrowserRouter>;
}

