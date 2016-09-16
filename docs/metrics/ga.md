[👈 Back to README](../../README.md)

# Google Analytics

Google Analytics is implemented on the website with the primary goal of analyzing flows, and identifying areas of improvement for the user.

Every event and pageview must include an invocation of [`sendToGA()`](https://github.com/mozilla/testpilot/blob/4eed50449a03207c49035ba605eda9db79224529/testpilot/frontend/static-src/app/main.js#L107).


## Events

Events are used to track interactions with the user. Mostly button or link clicks.

[Reference from Google](https://developers.google.com/analytics/devguides/collection/analyticsjs/events).

### Event structure

The structure for the events include 3 parts

- `eventCategory`: The name you supply for the group of objects you want to track.
- `eventAction`: A string that is uniquely paired with each category, and commonly used to define the type of user interaction for the web object.
- `eventLabel`: An optional string to provide additional dimensions to the event data.

### Samples of event structures

- [Install Test Pilot](https://github.com/mozilla/testpilot/blob/7b72e0102e100cdedfc8e02787688aed3d59a36a/testpilot/frontend/static-src/app/views/landing-page.js#L48)

This example shows the use of `outboundURL`. Anytime we are redirecting to another page we have to include this property.

```
app.sendToGA('event', {
  eventCategory: 'HomePage Interactions',
  eventAction: 'button click',
  eventLabel: 'Install the Add-on',
  outboundURL: downloadUrl
});
```

- [Toggle the settings menu](https://github.com/mozilla/testpilot/blob/a5d7644cc27aab9339dd241532be09c5534e0993/testpilot/frontend/static-src/app/views/settings-menu-view.js#L42).
```
app.sendToGA('event', {
  eventCategory: 'Menu Interactions',
  eventAction: 'drop-down menu',
  eventLabel: 'Toggle Menu'
});
```

### Table of events

Here are the current events on the website as of this writing

| Description                                              | eventCategory                      | eventAction       | eventLabel                   |
|----------------------------------------------------------|------------------------------------|-------------------|------------------------------|
| Toggle settings menu                                     | Menu Interactions                  | drop-down menu    | Toggle Menu                  |
| Click Leave from settings                                | Menu Interactions                  | drop-down menu    | Retire                       |
| Click Discuss from settings                              | Menu Interactions                  | drop-down menu    | Discuss                      |
| Click Wiki from settings                                 | Menu Interactions                  | drop-down menu    | wiki                         |
| Click File Issue from settings                           | Menu Interactions                  | drop-down menu    | File Issue                   |
| Click on experiment from landing page                    | ExperimentsPage Interactions       | Open details page | `{experiment title}`         |
| Click on Install from experiment details page            | ExperimentDetailsPage Interactions | button click | Install the Add-on                |
| Click on the "Try out these experiments as well" section | ExperimentsDetailPage Interactions | Open details page | try out `{experiment title}` |
| Click Enable Experiment                                  | ExperimentDetailsPage Interactions | button click      | Enable Experiment            |
| Click Disable Experiment                                 | ExperimentDetailsPage Interactions | button click      | Disable Experiment           |
| Click Give Feedback for experiment                       | ExperimentDetailsPage Interactions | button click      | Give Feedback                |
| Click Take Survey after disable                          | ExperimentDetailsPage Interactions | button click      | exit survey disabled         |
| Click Cancel on tour dialogue                            | ExperimentDetailsPage Interactions | button click      | cancel tour                  |
| Complete the tour                                        | ExperimentDetailsPage Interactions | button click      | complete tour                |
| Click Take Tour on tour dialogue                         | ExperimentDetailsPage Interactions | button click      | take tour                    |
| Click next during Tour                                   | ExperimentDetailsPage Interactions | button click      | forward to step `n`          |
| Click back during Tour                                   | ExperimentDetailsPage Interactions | button click      | back to step `n`             |
| Click on Install from landing page                       | HomePage Interactions              | button click      | Install the Add-on           |
| Click on experiment from landing page                    | HomePage Interactions              | Open details page | `{experiment title}`         |
| Click take survey after Leave                            | RetirePage Interactions            | button click      | take survey                  |
| Click on Twitter link in footer                          | FooterView Interactions            | social link clicked      | Twitter       |
| Click on GitHub link in footer                           | FooterView Interactions            | social link clicked      | GitHub        |
| Click on a button in the Share section                   | ShareView Interactions             | button click             | {facebook,twitter,email,copy} |

## Pageviews

testpilot.firefox.com is a single page application. This means that instead of just placing our JS snippet at the top of the page and registering every pageview on load, we have to manually trigger a pageview on every view.

TODO: issue [#839](https://github.com/mozilla/testpilot/issues/839#issuecomment-220110711) - this manually sets the page URL as well which makes pageview tracking for SPA more reliable.

### Pageview structure

The `pageview` send also uses `sendToGA`, but with slightly different parameters.

Here is an example - [viewing the home page](https://github.com/mozilla/testpilot/blob/7b72e0102e100cdedfc8e02787688aed3d59a36a/testpilot/frontend/static-src/app/views/landing-page.js#L35). 

```
app.sendToGA('pageview', {
  'dimension1': this.hasAddon,
  'dimension2': anyInstalled,
  'dimension3': installedCount
});
```

The URL does not need to be sent here. As seen in the above example, you can also include `Custom Dimensions` with the pageview calls.

### Custom Dimensions

We use custom dimensions to refine our pageviews on Test Pilot ([docs from Google](https://developers.google.com/analytics/devguides/collection/analyticsjs/custom-dims-mets)). Dimensions are unique to an application.

Here is a list of dimensions we are currently using

| Page                              | Description                                       | dimension | values |
|-----------------------------------|---------------------------------------------------|-----------|--------|
| Home Page, Experiment Detail Page, Share Page | Does the user have the add-on installed           | 1         | {0,1}  |
| Home Page, Share Page                         | Does the user have any experiments installed      | 2         | {0,1}  |
| Home Page, Share Page                         | How many experiments does the user have installed | 3         | {n}    |
| Experiment Detail Page                        | Is the experiment enabled                         | 4         | {0,1}  |
| Experiment Detail Page                        | Experiment title                                  | 5         | "xyz"  |
| Experiment Detail Page                        | Installation count                                | 6         | {n}    |

### Tagged Links

Whenever we are referring users to the Test Pilot website (either from an external website, or the add-on itself via a doorhanger/notification), we should include `utm_*` paramaters to allow us to properly measure conversion rates of the channel.

Here is a description of the different utm tags ([URL builder tool from Google](https://support.google.com/analytics/answer/1033867))

- `utm_source`: Identify the advertiser, site, publication, etc. that is sending traffic to your property, for example: google, newsletter4, billboard.
- `utm_medium`: The advertising or marketing medium, for example: cpc, banner, email newsletter.
- `utm_campaign`: The individual campaign name, slogan, promo code, etc. for a product.
- `utm_content`: Used to differentiate similar content, or links within the same ad. For example, if you have two call-to-action links within the same email message, you can use utm_content and set different values for each so you can tell which version is more effective.

### Table of tags

We should maintain a consistent convention when using campaign parameters.

| Description                                                   | utm_source      | utm_medium      | utm_campaign         | utm_content        |
|---------------------------------------------------------------|-----------------|-----------------|----------------------|--------------------|
| Clicking on an experiment (or "view all") from the doorhanger   | testpilot-addon               | firefox-browser | testpilot-doorhanger | 'badged' or 'not badged' depending on presence of 'New' badge on add-on toolbar button |
| Clicking on an experiment from the in-product messaging         | testpilot-addon               | firefox-browser | push notification      | {messageID}        |
| Tab opens after user has tried an experiment for n days (#1292) | testpilot-addon               | firefox-browser | share-page             | |
| Links that get shared from /share                               | {facebook,twitter,email,copy} | social          | share-page             | |
