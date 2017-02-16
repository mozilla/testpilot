[👈 Back to README](../README.md)

# Process

This document outlines how work is submitted, tagged, estimated and assigned in
Test Pilot.  It's focused on Engineering -- there are lots of other processes
going on before, during, and after this scope.

## Waffle

Test Pilot uses a [waffle board](https://waffle.io/mozilla/testpilot) to
organize issues.  The columns are:

* *Untriaged*:  These are new issues we haven't looked at yet.
* *Backlog*:  We've looked at these issues, but there are still some open
  questions or were not ready to start working on them yet.  Every issue in
  this column should have a `needs:*` label and/or have an open question for
  someone.
* *Ready*:  These issues have been triaged, questions are answered, assets are
  available, and work is ready to begin.  None of the issues here should have a
  `needs:*` label.
* *On Deck*:  This is a short list, ordered by priority, for what we're working
  on next.
* *In Progress*:  These issues are being actively worked on.  To be in this
  column an issue must be assigned to someone.
* *In Review*:  These issues are ready to be reviewed. PRs also land here.
* *Done*: These issues are closed.  That likely means a fix was committed, but
  it may mean an alternative was found or we decided to wontfix the issue.

An issue marked *done* is not necessarily live on the site.  Pushes are done
periodically (more details below).

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

## What is being worked on?

You can see a snapshot of what is being done right now by looking at the *In
Progess* column.  Everything in the *In Progress* column will have an assignee.

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
