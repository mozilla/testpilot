
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
  let seed = window.localStorage.getItem('testpilot-abtests-id', null);
  if (seed === null) {
    seed = String(Math.random());
    window.localStorage.setItem('testpilot-abtests-id', seed);
  }
  return variants[Math.floor(seedrandom(seed)() * summedWeight)];
}

const tests = [
  {
    name: 'foo',
    getValue: function () {
      if (!window.navigator.language.startsWith('en')) {
        return false;  // User gets whatever the DefaultCase is.
      }
      // 25% of users get blastoff, 25% houston, 50% default.
      return random({
        'blastoff': 1,
        'houston': 1,
        'default': 2
      });
    }
  }
];

const chosenVariants = {};

tests.forEach(test => {
  chosenVariants[test.name] = test.getValue();
});

export default handleActions({}, chosenVariants);
