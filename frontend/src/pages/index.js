import React from "react";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router";
import App from "../app/containers/App";
import store from "../app/store";
import ErrorPage from "../app/containers/ErrorPage";
import ExperimentPage from "../app/containers/ExperimentPage";
import HomePageWithAddon from "../app/containers/HomePage/HomePageWithAddon";
import HomePage from "../app/containers/HomePage";
import NotFoundPage from "../app/containers/NotFoundPage";
import OnboardingPage from "../app/containers/OnboardingPage";
import RetirePage from "../app/containers/RetirePage";

function wrap(component) {
  const s = store();
  const context = {};
  return <Provider store={ s }>
    <StaticRouter context={context}>
      <App>{ component }</App>
    </StaticRouter>
  </Provider>;
}

export function experiment(slug) {
  return wrap(<ExperimentPage slug={slug}/>);
}

export const pages = new Map(Object.entries({
  error: wrap(<ErrorPage/>),
  experiments: wrap(<HomePageWithAddon/>),
  home: wrap(<HomePage/>),
  notfound: wrap(<NotFoundPage/>),
  onboarding: wrap(<OnboardingPage/>),
  retire: wrap(<RetirePage/>)
}));
