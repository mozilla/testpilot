This document details the process we use to deploy Test Pilot to our stage and production environments.

## Team Notification ##

During the checkin before the end of the [current milestone](https://github.com/mozilla/testpilot/milestones), an email will be sent to our distribution list (`testpilot-dev@mozilla.com`) informing the team that we will be building a release against `master`.

Note: we auto deploy the master branch to our *development environment*: [http://testpilot.dev.mozaws.net](http://testpilot.dev.mozaws.net)

## Tag Release ##

This will happen on Friday at the end of sprint.

1. https://github.com/mozilla/testpilot/releases/new
2. Tag Version: YYYY-MM-DD (append -N if more than one release is tagged on a given day: 2016-04-08-1)
3. Release Title: YYYY-MM-DD
4. Click `Publish`
5. Wait for CircleCI to confirm that the release has passed ([tags uploaded to container](https://hub.docker.com/r/mozilla/testpilot/tags/)).

Please be as detailed as possible in the release notes.

## Request Deployment ##

This will happen on Friday at the end of sprint.

Once we've confirmed our release passed CircleCI, and we've confirmed that it is uploaded into the container, we need to request for Ops to deploy to stage.

This is done via a deployment bug.

Example: https://bugzilla.mozilla.org/show_bug.cgi?id=1263682

Include Softvision in the CC:

## Deployed Stage ##

This will happen on Friday at the end of sprint.

Ops will inform us once we are deployed to our *staging environment*: [http://testpilot.stage.mozaws.net](http://testpilot.stage.mozaws.net).

## Test Stage ##

This will happen on Friday at the end of sprint.

Send out an email notification to `testpilot-dev@mozilla.com` to please test the staging environment.

Include Softvision and the bug link in the email notification.

Follow the steps in the ["Test Pilot Deployment Verification Test Plan" doc](DEPLOYMENT-VERIFICATION.md) to verify that the site works as expected.

## Report Issues & Status ##

Any issues should be reported in the deployment bug.

If no issues are found, Softvision will note in the bug.

**Test Pilot team is still responsible for final approval for push to production.**

On the following Monday, during our checkin, Softvision will give us an update on status of stage.

## Approve Production ##

Once we are comfortable that the site has been tested, update the bug with approval to move to our *production environment*: [http://testpilot.firefox.com](http://testpilot.firefox.com).

## Verify Production ##

Softvision will verify production for us, and report any bugs.

