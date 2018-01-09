import React from "react";

import inject from "../app/lib/inject";
import NewsFeedPage from "../app/containers/NewsFeedPage";

export default function create() {
  return inject("news", <NewsFeedPage />);
}
