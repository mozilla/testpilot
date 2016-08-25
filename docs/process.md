[👈 Back to README](../README.md)

# Process

This document outlines how work is submitted, tagged, estimated and assigned in Test Pilot.

New work is proposed via [Issues](https://github.com/mozilla/testpilot/issues/new).

## Estimation

Please add a size to all new issues.

- `size:small` ~1 hour
- `size:medium` ~1 day
- `size:large` ~1 week
- `size:too large` >1 week

Estimation is an imperfect science, so please just give your best guess. If you're completely unsure of sizing, apply the `needs:size` label.

## Current Milestone

The current milestone is packed every 2 weeks, and coincides with the Friday before bi-weekly planning sessions. Planning sessions happen every 2nd Monday.

The milestones are planned in [waffle.io](https://waffle.io/mozilla/testpilot/), and a linked label is added in GitHub: [status:planned](https://github.com/mozilla/testpilot/issues?q=is%3Aissue+is%3Aopen+label%3A%22status%3A+planned%22).

## Status

- `status:ready`

This label is applied when all UX (`needs UX`), product and other discussions (`needs discussion`) have been sorted out.

This is linked to the `Ready` column on our waffle board.

- `status:planned`

This label is applied to work we have identified in our planning meeting as targeting our current milestone.

This is linked to the `Current Milestone` column on our waffle board.

- `status:in progress`

This label is applied when the assignee begins *active development or design* on the issue.

This is linked to the `In Progress` column on our waffle board.

Other notes:
- An issue only have a single `status:*` label.
- Everything packed in the current milestone should have the `status:planned` label.

## Assignees

Generally, an issue will have an assignee if that person is *working on the bug*, or plans to begin work in the next *day or two*.

## Things to work on?

A good way to find bugs that are available for work is to search for bugs which are `status:ready` and do not have an assignee. Or, if there is an assignee, [send a ping out to him or her](https://github.com/mozilla/testpilot/blob/master/CONTRIBUTING.md#saying-hello) to see if it's available for work.

## Waffle

As noted above, this repository is thinly integrated with our [waffle.io board](https://waffle.io/mozilla/testpilot). This board is mostly used for program management, and sprint planning.
