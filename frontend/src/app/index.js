import "../styles/main.scss";

import "babel-polyfill/browser";
import "whatwg-fetch";
import Raven from "raven-js";
import moment from "moment";

import "./lib/ga-snippet";
import config from "./config";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { setupAddonConnection } from "./lib/InstallManager";
import store from "./store";
import App from "./containers/App";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import HomePage from "./containers/HomePage";
import ExperimentPage from "./containers/ExperimentPage";
import RetirePage from "./containers/RetirePage";
import OnboardingPage from "./containers/OnboardingPage";
import NotFoundPage from "./containers/NotFoundPage";
import ErrorPage from "./containers/ErrorPage";

Raven.config(config.ravenPublicDSN).install();
moment.locale(window.navigator.language);


function appFactoryFor(Component) {
  return function appFactoryForComponent(props) {
    const match = props.match;
    if (match && match.params && match.params.slug) {
      return <App path={match.url}><Component slug={match.params.slug} /></App>;
    }
    return <App path={match.url}><Component/></App>;
  };
}

function routes() {
  return <BrowserRouter>
    <Switch>
      <Route exact path="/" render={appFactoryFor(HomePage)} />
      <Route exact path="/experiments" render={appFactoryFor(HomePage)} />
      <Route path="/experiments/:slug" render={appFactoryFor(ExperimentPage)} />
      <Route exact path="/onboarding" render={appFactoryFor(OnboardingPage)} />
      <Route exact path="/retire" render={appFactoryFor(RetirePage)} />
      <Route exact path="/error" render={appFactoryFor(ErrorPage)} />
      <Route render={appFactoryFor(NotFoundPage)} />
    </Switch>
  </BrowserRouter>;
}

const s = store();
const provider = <Provider store={ s }>
  { routes() }
</Provider>;

setupAddonConnection(s);
let node = document.getElementById("page-container");
if (node !== null) {
  node.remove();
}

node = document.createElement("div");
node.id = "page-container";
document.body.appendChild(node);

ReactDOM.render(provider, node);
