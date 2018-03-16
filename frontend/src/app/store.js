import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import promise from "redux-promise";

import addonReducer from "./reducers/addon";
import browserReducer from "./reducers/browser";
import experimentsReducer from "./reducers/experiments";
import localizationsReducer from "./reducers/localizations";
import newsletterFormReducer from "./reducers/newsletter-form";
import varianttestsReducer from "./reducers/varianttests";
import newsReducer from "./reducers/news";

import experiments from "../../build/api/experiments.json";
import newsUpdates from "../../build/api/news_updates.json";

export const reducers = combineReducers({
  addon: addonReducer,
  browser: browserReducer,
  experiments: experimentsReducer,
  localizations: localizationsReducer,
  newsletterForm: newsletterFormReducer,
  varianttests: varianttestsReducer,
  news: newsReducer
});

export const initialState = {
  experiments: {
    data: experiments.results
  },
  news: {
    updates: newsUpdates
  },
  addon: {
    // Null means we are being rendered at build time, and can't know
    // if the client will have the add on or not yet
    hasAddon: null,
    installed: {},
    installedLoaded: false,
    clientUUID: "",
    restart: {
      isRequired: false,
      forExperiment: null
    }
  }
};

try {
  if (typeof window !== "undefined") {
    initialState.addon.hasAddon = window.localStorage.getItem("hasAddon") === "true";
  }
} catch (e) {}

export function createMiddleware() {
  return compose(
    applyMiddleware(
      promise
    ),
    (typeof window !== "undefined" && window.devToolsExtension) ? window.devToolsExtension() : f => f
  );
}


export default function store() {
  return createStore(reducers, initialState, createMiddleware());
}
