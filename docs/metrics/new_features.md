[👈 Back to README](../../README.md)

# Measuring new features

Our features are tracked in a Test Pilot Trello board [ https://trello.com/b/TjEN1biU/test-pilot ].

Each card represents a feature along with UX and acceptance criteria.

## Formulate the question

The feature card must include a metrics question or questions we are attempting to answer based on the acceptance criteria

Example from https://trello.com/c/4PNAwpwQ/3-new-experiment-add-on-ui

- It should measure the engagement rate of the badged vs. unbadged toolbar icon
- it should measure experiment enables from clicks on the new experiment UI in the add-on doorhanger

## Create (a) measurement issue(s) for the feature that's part of the milestone.

- Define & publicly document the data collection schema that would answer the question.
- Should we just create an issue for this right away?
- Do we need a new dashboard/report for results?

## Google Analytics

https://github.com/mozilla/testpilot/blob/master/docs/ga.md

All measurements from within the web site are done in Google Analytics.  This includes links from the add-on to the website (meaning, we include GA variables in the URL).  GA provides a robust foundation for analytics and let's us have funnel tracking for free.

Read about the utm variables at:
https://support.google.com/analytics/answer/1033867?hl=en
https://blog.kissmetrics.com/how-to-use-utm-parameters/


Example:  I want to add a button to the browser's toolbar which links to the home page of Test Pilot and measures how many people click on it and then install the add-on:
This is a multi-step measurement (clicking on it *and* installing the add-on).  Fortunately, Google Analytics will do the hard parts of this for us for free.  Steps to follow:
We put initial recommendations for tag values in the issue, and CC Gareth (garethc on IRC) on the issue for comments.
Make the link to the home page with the appropriate utm_ variables.  An example: https://testpilot.firefox.com/experiments/tab-center?utm_source=testpilot-addon&utm_medium=firefox-browser&utm_campaign=testpilot-doorhanger&utm_content=badged
After push to production, notify Gareth when it goes live so he can confirm it is working and add to our dashboards

An aside, but if you want to put GA inside of an add-on, Google Analytics in Firefox addons would use this: https://developers.google.com/analytics/devguides/collection/protocol/v1/
