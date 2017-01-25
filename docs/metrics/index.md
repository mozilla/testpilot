[👈 Back to README](../../README.md)

# Overview

Test Pilot loves metrics.  Our whole purpose is to ask questions, measure and
analyze responses, and make recommendations.  To that end, we have a few tools
we use:

## Google Analytics

We build on a Google Analytics foundation for sheer breadth of built-in
functionality.  GA collects a lot of data for "free" which helps answer
unknown-unknowns when building rapid prototypes, and having real-time results
is just gravy.  We use GA for all basic measuring, funnel tracking,
click-through rates, and simple A/B testing.

## Ping Centre

The Ping Centre (originally known as the Tiles Pipeline) is used by [Activity
Stream](https://github.com/mozilla/activity-stream) and is something we're
evaluating for collecting event based data.  We expect to trial it in addition
to the other pipelines in the next couple of experiments to get a feel for
where it fits in best.

## [Telemetry](https://wiki.mozilla.org/Telemetry/FAQ)

Part of the process of getting into the Test Pilot program is defining what
questions you are trying to answer and what success looks like.

Google Analytics does a lot of great things generically, but comes up short
when trying to do deep analysis on data, which is usually where those big
defining questions lay.

To help answer those questions, we use Telemetry and record specific,
pre-defined data about the experiment.  Each experiment will record different
data (see each experiments' documentation for details) but at a high level,
this will apply for:

* Daily and Monthly Active User calculations
* Anything that needs to easily compare or join with other Firefox Telemetry
  data
* Any experiments with peculiar privacy policies where it's important to keep
  the data in a specific place (eg. a legal obligation)

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
([1](https://github.com/meandavejustice/min-vid/blob/master/docs/metrics.md),
[2](https://github.com/mozilla/universal-search/blob/master/docs/metrics.md),
[3](https://github.com/internetarchive/FirefoxNoMore404s/blob/master/docs/metrics.md))
but it's important to understand that this is an evolving process and these
examples may not represent the current needs (for example, none of the above
leverage Google Analytics).

The Metrics plan should be looked at by the Mozilla Measurement & Analytics
Teams to make sure avoid implementation troubles.

# Implementing Metrics in an Experiment

The Metrics Plan you've written should serve as a blueprint for implementation.

## Telemetry
To use Telemetry you'll need to make sure the Mozilla Measurement Team is aware
a new experiment is starting up.  That involves filing a bug to get Test Pilot
Experiment data into re:dash, and then creating a re:dash dashboard.  Feel free
to [clone these two bugs](https://bugzilla.mozilla.org/buglist.cgi?quicksearch=1297199%2C+1297200).

The Measurement Team will be looking at the Metrics Plan you wrote to
understand what is needed so it's important that it includes the schema you'll
be logging your data to.

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
provided by the [`testpilot-metrics` npm package](https://www.npmjs.com/package/testpilot-metrics).
See the [`testpilot-metrics` docs](https://github.com/mozilla/testpilot#readme)
for API docs and working SDK and WebExtension examples.

Here is a quick overview:

Add `testpilot-metrics` to your package.json file
```javascript
"dependencies": {
  "testpilot-metrics": "1.0.0",
  ...
}
```

Call the Metrics constructor, passing in your add-on ID and version, a non-PII
(non-personally identifiable) user ID, and your Google Analytics tracking
ID (if you are using GA):

```javascript

const Metrics = require('testpilot-metrics');

const { sendEvent } = new Metrics({
  id: '@my-addon',
  version: '1.0.2',
  uid: 'some-non-PII-user-ID',
  tid: 'UA-XXXXXXXX-YY'
});

```

Call testpilot.sendEvent()
```javascript
sendEvent({
  object: 'webext-button',
  method: 'click'
});
```

The testpilot.sendEvent() function accepts these parameters:

* `object`: What is being affected?  eg. `home-button-1`
* `method`: What is happening?  eg. `click`
* `category` (optional): If you want to add a category for easy reporting
  later. eg. `mainmenu`
* `variant` (optional): Name of the multivariate or A/B test group the user
   belongs to. eg. `green-button`
* `transform` (optional): A function used to alter the format of the object
   sent to GA.

These parameters will be combined with other data (like a timestamp and system
information) in the sendEvent() function and the broker will send the data to
the appropriate endpoints.

> TODO:
> * need to specify what "system information" is, if for no other reason than we
> need a schema for it.  Includes add-on version, client id, locale, etc.

If some of the data you need to collect doesn't fit an event/object model it's
possible to ping the endpoints directly.  In that case, the custom pings will
be detailed in the Metrics Plan so all the teams can prepare for them.

# Wow, that's kind of complicated

We're all here to help.  This document exists as documentation for us as much
as anyone -- don't feel like you have to go at this alone, it just needs to be
written down so we don't forget steps. 😺
