[👈 Back to README](../../README.md)

## Deployment & Hosting

Test Pilot experiments are hosted on testpilot.firefox.com which lets them get
installed in Firefox with a minimal amount of user prompting and warning
messages.  The process of getting add-ons on testpilot.firefox.com is
documented below -- basically a series of shell scripts glued together with
environment variables.

### tl;dr The Experiment Requirements

Your repository must use a branch called `production` to hold the code you want
to deploy.

You must give the *Mozilla Test Pilot* user ownership access to your add-on on
AMO (so it can sign new copies).

Your repository must include a `bin/build-addon.sh` script which, when run,
will:

0. Fail with a non-zero status if anything goes wrong
0. Build an .xpi file named `signed-addon.xpi` and put it in the
   current working directory
0. Sign that add-on, using the credentials in `TESTPILOT_AMO_USER` and
   `TESTPILOT_AMO_SECRET` environment variables
0. If your add-on contains a package.json with `id` and `version` fields you
   are done.  If not, you must write an `addon.env` file in the current working
   directory which contains those values in a bash-sourcable format.  An
   example `addon.env` file:
```
   TESTPILOT_ADDON_ID=experiment@mozila
   TESTPILOT_ADDON_VERSION=1.2
```
Note the lack of quotes.  These values are validated against `/^TESTPILOT_ADDON_(ID=[a-z0-9@-]+|VERSION=[0-9a-z.-]+)\$/`.

*There is a package which simplifies the signing and distributing process for jpm addons. [deploy-txp](https://github.com/meandavejustice/deploy-txp). For an example, you can see it's usage in [min-vid](https://github.com/meandavejustice/min-vid/)*

## The bigger picture

The full publishing flow is as follows:

0. An experiment maintainer commits to the `production` branch
0. Mozilla's Jenkins instance sees the commit (currently polling every minute)
0. Jenkins downloads the latest source code from the `production` branch and
   does any internal checks.  These checks may include branch checks,
   verification that an authorized user made the commit, checks for passing
   tests, or other checks.
0. Jenkins will set the `TESTPILOT_AMO_USER` and `TESTPILOT_AMO_SECRET`
   environment variables
0. Jenkins will run `bin/build-addon.sh`
0. Jenkins will prepare appropriate S3 files (the signed .xpi file, /latest/
   redirect, a new updates.json file)
0. Jenkins will put those files into the appropriate bucket in S3 so they show
   up on testpilot.firefox.com and have all the right security and caching
   headers
0. Notifications of progress through this flow are made on IRC
