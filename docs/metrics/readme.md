[👈 Back to README](../../README.md)

# Overview

Test Pilot loves metrics.  Our whole purpose is to ask questions, measure and
analyze responses, and make recommendations.  To that end, we have a few tools
we use:

## Google Analytics

We use Google Analytics for sheer breadth of built-in
functionality.  GA collects a lot of data for "free" which helps answer
unknown-unknowns when building rapid prototypes, and having real-time results
is just gravy.  We use GA for all basic measuring, funnel tracking,
click-through rates, and simple A/B testing.

# Making a Plan

In [Phase 1](https://wiki.mozilla.org/Test_Pilot#How_does_Test_Pilot_Work.3F)
of the Test Pilot program an experiment must have a Metrics Plan.  The purpose
of the plan is to document what questions an experiment is trying to answer,
how it will answer them, what success looks like (that is, how do we know when
we're done?), and to help narrow an experiments scope so it focuses on what
will truly answer the question.  Often we'll come into an experiment with ideas
on how to measure something and after writing this document realize that there
are better options.

The document is expected to be at the `docs/metrics.md` path from the root of
the repository.  Ideally it includes actual sketches of dashboard visuals the
experiment leads would like to see.  It should include any special
circumstances or requirements in the experiment, as well as details on how the
metrics will be collected (keys, schemas, names of elements, etc.)

Several examples exist
([1](https://github.com/mozilla/FirefoxColor/blob/master/docs/metrics.md),
[2](https://github.com/mozilla/notes/blob/master/docs/metrics.md),

The Metrics plan should be looked at by the Mozilla Measurement & Analytics
Teams to make sure avoid implementation troubles.

# Implementing Metrics in an Experiment

The Metrics Plan you've written should serve as a blueprint for implementation.

## Google Analytics
To use Google Analytics you'll need to have your Google Analytics credentials
to record data.  Using your own account here instead of a generic Test Pilot
account makes the transition easy when your experiment graduates from the Test
Pilot program.  (Note that for the extent of the Test Pilot experiment you'll
need to grant access to analytics for the Test Pilot team).

In order to take full advantage of Google Analytics it's important to follow
the Metrics Plan you outlined above -- this will let you use the built-in
e-commerce, funnel, and goal conversion features which will lead to speedy
analysis.

## Sending Data

The actual function to report event based data is called `sendEvent()` and is
provided by the [`testpilot-ga` npm package](https://www.npmjs.com/package/testpilot-ga).
See the [`testpilot-ga` docs](https://github.com/mozilla/testpilot-ga)
for API docs and examples.

Here is a quick overview:

Add `testpilot-ga` to your project:

`npm install --save-dev testpilot-ga`

Call the Metrics constructor, passing in your add-on ID and version, a non-PII
(non-personally identifiable) user ID, and your Google Analytics tracking
ID (if you are using GA):

```javascript

import TestPilotGA from 'testpilot-ga';

const analytics = new TestPilotGA({
  aid: 'test-experiment@mozilla.com',
  an: 'Test Experiment',
  av: '1.0.0',
  cd19: 'production',
  ds: 'addon',
  tid: 'UA-71632928-4'
});

```

Call analytics.sendEvent()
```javascript
analytics
  .sendEvent('ec_value', 'ea_value', {
    cd1: 'cd1_value',
    cm1: 'cm1_value'
  })
  .then(response => {
    console.log('Event successfully sent', response)
  })
  .catch(err => {
    console.error('Event failed while sending', err)
  });
```

# Don't be afraid to ask questions

We're all here to help.  This document exists as documentation for us as much
as anyone -- don't feel like you have to go at this alone, it just needs to be
written down so we don't forget steps. 😺
