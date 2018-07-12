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

Here are the current events on the website as of this writing, grouped by their `eventCategory`:

#### `Menu Interactions`

| Description | `eventAction` | `eventLabel` |
|-------------|---------------|--------------|
| Click Firefox logo from header | click | Firefox logo |
| Visit blog from menu | click | open blog |
| Toggle settings menu | drop-down menu | Toggle |
| Click `Leave` from settings | drop-down menu | Retire |
| Click `Discuss` from settings | drop-down menu | Discuss |
| Click `Wiki` from settings | drop-down menu | wiki |
| Click `File Issue` from settings | drop-down menu | File Issue |

#### `ExperimentsPage Interactions`

| Description | `eventAction` | `eventLabel` |
|-------------|---------------|--------------|
| Click on experiment from landing page | Open detail page | `{experiment title}` |

#### `ExperimentDetailsPage Interactions`

| Description | `eventAction` | `eventLabel` |
|-------------|---------------|--------------|
| Click on Install from experiment details page | install button click | Install the Add-on from `${experiment title}`|
| Click on the "Try out these experiments as well" section | Open detail page | try out `{experiment title}` |
| Click Enable Experiment | Enable Experiment | `{experiment title}` |
| Click Link to Web Experiment | Go to Web Experiment | `{experiment title}` |
| Click Disable Experiment | Disable Experiment | `{experiment title}` |
| Click Give Feedback for experiment | Give Feedback | `{experiment title}` |
| Click Give Feedback for experiment from PreFeedback | PreFeedback Confirm | `{experiment title}` |
| Click upgrade notice | Upgrade Notice | `{experiment title}` |
| Click Take Survey after disable | button click | exit survey disabled |
| Click Cancel on tour dialogue | button click | cancel tour |
| Complete the tour | button click | complete tour |
| Click Take Tour on tour dialogue | button click | take tour |
| Click next during Tour | button click | forward to step `n` |
| Click back during Tour | button click | back to step `n` |
| Click pagination dot during Tour | button click | dot to step `n` |
| Cancel during PreFeedback confirmation | button click | cancel feedback |
| Accept Firefox permission dialog | Accept From Permission | `{experiment title}`
| Cancel Firefox permission dialog | Cancel From Permission | `{experiment title}`
| Send experiment app link to device | mobile send click | `{experiment title}` |
| Click app store links on experiment page | mobile store click | `{experiment title}` `{ios \|\| android}` |

#### `SMS Modal Interactions`
| Description | `eventAction` | `eventLabel` |
|-------------|---------------|--------------|
| Click app store links in modal | mobile link request | `{sms \|\| email}` |
| Send experiment link  success | request handled | success |
| Send experiment link error | request handled | error |
| Cancel Send link to device dialog | dialog dismissed | cancel Send link to device dialog|

#### `HomePage Interactions`

| Description | `eventAction` | `eventLabel` |
|-------------|---------------|--------------|
| Click on Install from landing page | install button click | Install the Add-on |
| Click on the no thank you survey after coming from no experiments notification | button click | no experiments no thank you |
| Click on experiment from landing page | Open detail page | `{experiment title}` |
| Click on newsletter subscription submit | button click | Sign me up |
| Email address successfully submitted to basket | button click | email submitted to basket |
| Skips submitting email to basket | button click | Skip email |
| Goes on to experiments after email form | button click | On to the experiments |
| Email submission to basket from footer failed | footer newsletter form submit | email failed to submit to basket |
| Email submission to basket from footer succeeded | footer newsletter form success | email submitted to basket |
| Retire from Test Pilot | button click | Retire |
| Shows upgrade notice | Upgrade Warning | upgrade notice shown |

#### `Featured Experiment`

| Description                      | `eventAction`         | `eventLabel`                  | Custom Dimensions          |
| -------------------------------- | --------------------- | ----------------------------- | -------------------------- |
| Click Featured Experiment Video  | video click           | Play Featured video           | [1, 2, 3, 12, 10, 11, 13]  |
| Click View Details               | link click            | View Featured details         | [1, 2, 3, 4, 10, 11, 13]   |
| Featured Experiment Button       | button click          | Manage Featured Button State  | [1, 2, 3, 4, 5, 10, 11, 13]|
| Click Cancel on tour dialogue    | button click          | cancel tour                   | [1, 2, 3, 10, 11, 13]      |
| Complete the tour                | button click          | complete tour                 | [1, 2, 3, 10, 11, 13]      |
| Click next during Tour           | button click          | forward to step `n`           | [1, 2, 3, 10, 11, 13]      |
| Click back during Tour           | button click          | back to step `n`              | [1, 2, 3, 10, 11, 13]      |
| Click pagination dot during Tour | button click          | dot to step `n`               | [1, 2, 3, 10, 11, 13]      |
| Click General Terms link         | link click            | Open general terms            | [1, 2, 3, 10, 11, 13]      |
| Click General Privacy link       | link click            | Open general privacy          | [1, 2, 3, 10, 11, 13]      |
| Click Featured Privacy link      | link click            | Popup Featured privacy        | [1, 2, 3, 10, 11, 13]      |
| Send experiment app link to device | mobile send click | `{experiment title}` | [1, 4, 5, 6, 10, 11] |

#### `RetirePage Interactions`

| Description | `eventAction` | `eventLabel` |
|-------------|---------------|--------------|
| Click take survey after Leave | button click | take survey |

#### `FooterView Interactions`

| Description | `eventAction` | `eventLabel` |
|-------------|---------------|--------------|
| Click on Twitter link in footer | social link clicked | Twitter |
| Click on GitHub link in footer | social link clicked | GitHub |

#### `ShareView Interactions`

| Description | `eventAction` | `eventLabel` |
|-------------|---------------|--------------|
| Click on a button in the Share section | button click | {facebook,twitter,email,copy} |

#### `PostInstall Interactions`

| Description | `eventAction` | `eventLabel` |
|-------------|---------------|--------------|
| Prompted to restart the browser | view modal | restart required |

#### `NewsUpdatesDialog Interactions`

| Description | `eventAction` | `eventLabel` |
|-------------|---------------|--------------|
| Click next during news updates dialog | button click | forward to step `n` |
| Click back during news updates dialog | button click | back to step `n` |
| Click pagination dot during news updates dialog | button click | dot to step `n` |
| Dismiss news updates dialog | button click | cancel updates |
| Complete news updates | button click | complete updates |


\* Indicates whether or not a restart is required.

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

| Page                                          | Description                                             | dimension | values |
|-----------------------------------------------|---------------------------------------------------------|-----------|--------|
| Home Page, Experiment Detail Page, Share Page | Does the user have the add-on installed                 | 1         | {0,1}  |
| Home Page, Share Page                         | Does the user have any experiments installed            | 2         | {0,1}  |
| Home Page, Share Page                         | How many experiments does the user have installed       | 3         | {n}    |
| Experiment Detail Page                        | Is the experiment enabled                               | 4         | {0,1}  |
| Experiment Detail Page                        | ~Experiment title~ USE dimension11 instead!             | 5         | "xyz"  |
| Experiment Detail Page                        | Installation count                                      | 6         | {n}    |
| Home Page, Experiment Detail Page             | Determine if installation will require a restart        | 7         | {'no restart','restart required'}   |
| Home Page, Experiment Detail Page, Share Page | Which test has this user been selected for?             | 8         | {'installButtonBorder', ''} |
| Home Page, Experiment Detail Page, Share Page | Which cohort has this user been selected for?           | 9         | {'bigButton', ''} |
| All                                           | In which responsive breakpoint is the user?             | 10        | {'mobile','small','medium','big'} |
| All experiment-specific locations and events  | On which experiment did this action take?               | 11        | experiment slug |
| Home Page                                     | How much did the video did the user watch?              | 12        | {'None (<10)','Some (10-90)','All (>90)'}|
| Home Page, Experiment Detail Page             | Which section did this action occur?                    | 13        | {'Experiment Detail', 'Experiment List', 'Featured Experiment'}


### Tagged Links

Whenever we are referring users to the Test Pilot website (either from an external website, or the add-on itself via a doorhanger/notification), we should include `utm_*` paramaters to allow us to properly measure conversion rates of the channel.

Here is a description of the different utm tags ([URL builder tool from Google](https://support.google.com/analytics/answer/1033867))

- `utm_source`: Identify the advertiser, site, publication, etc. that is sending traffic to your property, for example: google, newsletter4, billboard.
- `utm_medium`: The advertising or marketing medium, for example: cpc, banner, email newsletter.
- `utm_campaign`: The individual campaign name, slogan, promo code, etc. for a product.
- `utm_content`: Used to differentiate similar content, or links within the same ad. For example, if you have two call-to-action links within the same email message, you can use utm_content and set different values for each so you can tell which version is more effective.

### Table of tags

We should maintain a consistent convention when using campaign parameters.

| Description                                                            | utm_source                    | utm_medium      | utm_campaign           | utm_content              |
|------------------------------------------------------------------------|-------------------------------|-----------------|------------------------|--------------------------|
| Clicking on an experiment (or "view all") from the doorhanger          | testpilot-addon               | firefox-browser | testpilot-doorhanger   | {'badged','not badged'}  |
| Clicking on an experiment from the in-product messaging                | testpilot-addon               | firefox-browser | push notification      | {messageID}              |
| Tab opens after user has tried an experiment for n days (#1292)        | testpilot-addon               | firefox-browser | share-page             |                          |
| Links that get shared from /share                                      | {facebook,twitter,email,copy} | social          | share-page             |                          |
| User hits home page after being sent by the add-on after installation. | testpilot-addon               | firefox-browser | restart-required       |                          |
| Clicks on the no experiments installed notification                    | testpilot-addon               | firefox-browser | testpilot-notification | no-experiments-installed |
* Indicates whether the toolbar button had the 'New' badge on it.
