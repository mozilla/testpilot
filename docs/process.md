[👈 Back to README](../README.md)

# Process

This document outlines how work is submitted, tagged, estimated and assigned in
Test Pilot.  It's focused on Engineering -- there are lots of other processes
going on before, during, and after this scope.

## New Work

New work is proposed via [Issues](https://github.com/mozilla/testpilot/issues/new).

## Triage

Generally, triage will review the *Untriaged* column on the Waffle board.  If
an issue isn't clear, complete, or has dependencies:
* Ask the question in the issue and @-tag the person who can help
* Use the `needs:discussion`, `needs:moreinfo`, `needs:product`, `needs:qa`,
  and `needs:ux` labels
* Move the issue to *Backlog*

If the issue is ready to be worked on:
* Consider labels (perhaps it's a `good-first-bug`?)
* Move the issue to *Ready*

## How are priorities determined?
Anything with a `critical` label is a top priority.

Past that, it's a bit fuzzier.  Our stand-ups will help determine what is
important, and the ordering of the waffle column can help guide, but we don't
have strict assignments here.  We may need to evolve some priority labels.

## Things to work on?

A good way to find bugs that are available for work is to [search for bugs
which are
`status:ready`](https://github.com/mozilla/testpilot/labels/status%3A%20ready).
If you're new to the project, [look for bugs with the `good-first-bug`
label](https://github.com/mozilla/testpilot/labels/good-first-bug).

## Meetings

Test Pilot has regular stand-ups and triages as well as other one-off meetings.
The best way to keep abreast of meetings is to [look at our
calendar](https://wiki.mozilla.org/Test_Pilot#Come_to_our_meetings.21) .
