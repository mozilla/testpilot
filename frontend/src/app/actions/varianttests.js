// @flow

import type { ChooseTestsAction } from "../reducers/varianttests";

export function chooseTests(): ChooseTestsAction {
  return {
    type: "CHOOSE_TESTS"
  };
}
