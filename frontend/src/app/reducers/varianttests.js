// @flow

import seedrandom from 'seedrandom';

type TestChooser = {
  name: string,
  getValue: () => string
};

type ChosenVariantsState = {
  [name: string]: string
};

type ChosenTestState = {
  test: string,
  variant: string
};

function random(choices: { [name: string]: number }): string {
  let summedWeight = 0;
  const variants = [];
  const choiceNames: Array<string> = Object.keys(choices);
  for (const name of choiceNames) {
    const weight = choices[name];
    summedWeight += weight;
    for (let i = 0; i < weight; i++) {
      variants.push(name);
    }
  }
  let seed = window.localStorage.getItem('testpilot-varianttests-id', null);
  if (seed === null) {
    seed = String(Math.random());
    window.localStorage.setItem('testpilot-varianttests-id', seed);
  }
  return variants[Math.floor(seedrandom(seed)() * summedWeight)];
}

const tests: Array<TestChooser> = [
  {
    name: 'installButtonBorder',
    getValue: function getValue() {
      if (!window.navigator.language.startsWith('en')) {
        return 'default';  // User gets whatever the DefaultCase is.
      }
      return random({
        bigBorder: 1,
        default: 1
      });
    }
  }
];

const chosenVariants: ChosenVariantsState = {};

let chosenTest: ChosenTestState | null = null;

tests.forEach(test => {
  // Only put each user in one test. If we previously found a non-default test,
  // put this user in default for the rest of the tests.
  if (chosenTest !== null) {
    chosenVariants[test.name] = 'default';
  } else {
    const chosen = test.getValue();
    if (chosen !== 'default') {
      chosenTest = {
        test: test.name,
        variant: chosen
      };
    }
    chosenVariants[test.name] = chosen;
  }
});

export function getChosenTest(): ChosenTestState {
  if (chosenTest === null) {
    return {
      test: '',
      variant: ''
    };
  }
  return chosenTest;
}

export default function variantTestsReducer(): ChosenVariantsState {
  return chosenVariants;
}
