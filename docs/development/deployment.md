[👈 Back to README](../../README.md)

This document details the process we use to deploy Test Pilot to our stage and production environments.

## Overview of schedule ##

- Thursday (a week before we freeze) merge new strings to the `l10n` branch so
  localizers have a week to get any new strings in.  Hold off committing any
  major new strings at this point.
- Thursday (a week after step 1) at 1pm PST the train is cut, all code is in.
- Thursday at 4pm PST we tag and push stage, and send email out.
- Friday is a buffer day.
- Monday at regular stand-up we review anything that Softvision found and fix it.
- Tuesday at 8am PST we push and Softvision verifies.

## Softvision ##

Softvision is our embedded QA team. They maintain the test plans, verify bugs
as they are closed, and ensure deployments don't push new bugs into the wild.

## Merge master to l10n ##

We try to front load any patches that have major string changes into the first
week of the sprint so we can give localizers time to work on them.  When it's
time to merge `master` to `l10n` follow the steps below.

```
git checkout master
git pull mozilla master
git checkout -b l10n mozilla/l10n  # If you already have an l10n branch this can just be: git checkout l10n
git pull mozilla l10n
git merge master
git push mozilla l10n
```

## Team Notification ##

During the checkin before the end of the [current milestone](https://github.com/mozilla/testpilot/milestones), we will inform the team that we will be building a release against `master`.

Note: we auto deploy the master branch to our *development environment*: [https://testpilot.dev.mozaws.net](https://testpilot.dev.mozaws.net)

## Merge l10n to master ##

Before tagging the release, merge the l10n branch into the master branch. These commands assume the remote named `mozilla` points at the mozilla repository on github.

`git checkout -b l10n mozilla/l10n && git pull mozilla l10n && git checkout master && git pull mozilla master && git merge l10n && git push mozilla master`


## Tag Release ##

This will happen on Thursday at the end of sprint.

0. Did the add-on code change?  Double check that the version got bumped.  [example](https://github.com/mozilla/testpilot/commit/21564e46f244998bb5bf3f70b05734b7f1605592)
1. https://github.com/mozilla/testpilot/releases/new
2. Tag Version: YYYY-MM-DD (append -N if more than one release is tagged on a given day: 2016-04-08-1)
3. Release Title: YYYY-MM-DD
4. Click `Publish`

Please be as detailed as possible in the release notes. Examples - [2016-07-05](https://github.com/mozilla/testpilot/releases/tag/2016-07-05), [2016-06-06](https://github.com/mozilla/testpilot/releases/tag/2016-06-06)

## Push to Stage ##

This will happen on Thursday at the end of sprint.

1. `git checkout stage`  (No luck?  Try `git fetch mozilla` and `git checkout -b stage mozilla/stage` -- both commands assume your remote is named `mozilla`)
2. `git reset --hard YYYY-MM-DD`  # whatever your tag name is
3. `git push mozilla stage -f`  # Replace `mozilla` with whatever you name your upstream.  The `-f` is only necessary if we cherry-picked patches when we pushed last time.

Notifications of successful deployment will appear on IRC.

## Test Stage ##

This will happen on Thursday at the end of sprint after we've pushed to stage.

Create a deployment issue to track status and potential blockers. [Example](https://github.com/mozilla/testpilot/issues/1643). Give it a `needs:qa` label.

Send out an email notification to `testpilot-qa@softvision.ro` to please test the staging environment. [Example](https://mail.mozilla.org/pipermail/testpilot-dev/2016-October/000306.html).

Include Softvision and the issue link in the email notification.

Follow the steps in the ["Test Pilot Deployment Verification Test Plan" doc](DEPLOYMENT-VERIFICATION.md) to verify that the site works as expected. Along with testing any major features in the release.

## Report Issues & Status ##

Any issues should be reported in the deployment bug.

If no issues are found, Softvision will note in the bug.

**Test Pilot team is still responsible for final approval for push to production.**

On the following Monday, during our checkin, Softvision will give us an update on status of stage.

## Deploy Production ##

Once we are comfortable that the site has been tested:

1. `git checkout production`
2. `git reset --hard YYYY-MM-DD`  # whatever your tag name is
3. `git push mozilla production -f`  # Replace `mozilla` with whatever you name your upstream.  The `-f` is only necessary if we cherry-picked patches when we pushed last time.

Notifications of successful deployment will appear on IRC.

We'll target Tuesday 8AM PST for deployment.

## Verify Production ##

Softvision will verify production for us, and report any bugs on Tuesday.

Once we have verified production, update the "testpilot.firefox.com (production)" GA account with an annotation including sprint information. Example: "Sprint-12 Pushed to Prod" Oct. 25th.

Close deployment issue, and give it a `qa:verified` label.

## Rolling Back/Forward Process ##

If something is found that requires an immediate change to production (or staging) code, please follow the below guidelines.

In all cases, engineering will have the final approval on the roll back.

Ideally, we should "roll forward" with `git revert` to undo problematic commits and push a new release. Of course, that's also problematic if we don't know what commits caused a problem. Or if the problematic commits also included the database migrations - in which case, we also need to pair the `git revert` with a commit that undoes the migration.

## Producing a Static Build ##

From a fresh check-out, producing a static build can be done like so:

```
git clone https://github.com/mozilla/testpilot.git
cd addon
npm install
npm run sign  # Requires AMO credentials in AMO_USER and AMO_SECRET env vars
npm run package  # No AMO credentials required, but the add-on is unsigned
cd ..
npm install
NODE_ENV=production ENABLE_PONTOON=0 npm run static
```

After all the above commands, you should have an optimized static build of the
site in the `dist` directory.

If you'd like to preview this static build of the site, you can start up a
local web server pointed at the `dist` directory with this npm script:

```
npm run server:dist
```

The `NODE_ENV` variable in the last command can be set to `development` to
produce a build that's easier to debug, at the expense of JS bundle size and
performance.

The `ENABLE_PONTOON` variable can be set to `1` if you want to include a
`<script>` tag that loads JS from [the Pontoon localization
service](https://pontoon.mozilla.org/) - something we generally do not want to
do in production environments (see [#1356](https://github.com/mozilla/testpilot/issues/1356)).
