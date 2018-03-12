
import React from "react";

import inject from "../app/lib/inject";
import ExperimentPage from "../app/containers/ExperimentPage";

export default function create(slug) {
  return inject(
    "experiment",
    <ExperimentPage slug={slug} />
  );
}
