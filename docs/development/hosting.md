[👈 Back to README](../../README.md)

## Deployment & Hosting

Test Pilot experiments are hosted on testpilot.firefox.com which lets them get
installed in Firefox with a minimal amount of user prompting and warning
messages.  The process of getting add-ons on testpilot.firefox.com is
documented below.

### tl;dr The Experiment Requirements

Your repository must use a branch called `production` to hold the code you want
to deploy.

Your repository must include a `npm run package` script which, when run, will
build the add-on and leave it in a file named `addon.xpi` in the root
directory.

Your add-on must use a custom update URL.  Examples follow, replace `%ID%` with
your add-on's ID:

`install.rdf`
```xml
<em:updateURL>https://testpilot.firefox.com/files/%ID%/updates.json</em:updateURL>
```

`manifest.json`
```json
"applications": {
  "gecko": {
    "id": "%ID%",
    "update_url": "https://testpilot.firefox.com/files/%ID%/updates.json"
  }
},
```

You must add `--self-hosted` if you run the add-ons linter.  This is often an
npm command in package.json.  For example:

`package.json`
```
"scripts": {
  "lint:addon": "addons-linter build/addon --self-hosted",
...
}
```


## The bigger picture

The full publishing flow is as follows:

0. An experiment maintainer commits to the `production` branch
0. Mozilla's Jenkins instance sees the commit (currently polling every minute)
0. Jenkins downloads the latest source code from the `production` branch and
   does any internal checks.  These checks may include branch checks,
   verification that an authorized user made the commit, checks for passing
   tests, or other checks.
0. Jenkins will run `npm install` followed by `npm run package`
0. Jenkins will prepare appropriate S3 files (the signed .xpi file, a /latest/
   redirect, and a new updates.json file)
0. Jenkins will put those files into the appropriate bucket in S3 so they show
   up on testpilot.firefox.com and have all the right security and caching
   headers
0. Notifications of progress through this flow are made on IRC
