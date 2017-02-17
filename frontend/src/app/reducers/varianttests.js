
import seedrandom from 'seedrandom';

import { handleActions } from 'redux-actions';

function random(choices) {
  let summedWeight = 0;
  const variants = [];
  Object.entries(choices).forEach(([name, weight]) => {
    summedWeight += weight;
    for (let i = 0; i < weight; i++) {
      variants.push(name);
    }
  });
  let seed = window.localStorage.getItem('testpilot-varianttests-id', null);
  if (seed === null) {
    seed = String(Math.random());
    window.localStorage.setItem('testpilot-varianttests-id', seed);
  }
  return variants[Math.floor(seedrandom(seed)() * summedWeight)];
}

const tests = [
  {
    name: 'experimentPageToggles',
    getValue: function getValue() {
      if (!window.navigator.language.startsWith('en')) {
        return 'default';  // User gets whatever the DefaultCase is.
      }
      return random({
        toggles: 1,
        default: 1
      });
    }
  }
];

const chosenVariants = {};
const identityReducers = {};

let chosenTest = null;

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
  identityReducers[test.name] = state => state;
});

export function getChosenTest() {
  if (chosenTest === null) {
    return {
      test: '',
      variant: ''
    };
  }
  return chosenTest;
}

export default handleActions(identityReducers, chosenVariants);
