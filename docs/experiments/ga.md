[👈 Back to README](../../README.md)

# Experiment Metrics
Test Pilot experiments use Google Analytics for metrics collection, and Google Data Studio for visualization and reporting. Each experiment should create and use a new property in Mozilla’s Google Analytics account. If you need help doing so, please talk to Wil Clouser.

Events are reported through the low-level [Google Analytics Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/). Refer to the documentation for the [developer guide](https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide) and [parameter reference](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters) to understand to basics of how data is reported. The [hit builder](https://ga-dev-tools.appspot.com/hit-builder/) can help you construct and validate events before reporting. Use the [`testpilot-ga` library](https://www.npmjs.com/package/testpilot-ga) to simplify the reporting prociess.

## testpilot-ga package
We have a package on npm to simplify sending ga pings in a testpilot experiment.
https://github.com/mozilla/testpilot-ga

## Submission
The following fields are used in experiment event reporting. All fields are required, unless noted. Experiments should implement additional properties of [sessions](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#session), [exceptions](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#exception), [social interactions](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#social), [traffic sources](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#trafficsources), [content information](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#content), and [system attributes](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#system), where appropriate.

### General Fields
- [`v`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#v) - this indicates the version of the measurement protocol being used. Currently always `1`.
- [`tid`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#tid) - this indicates the ID of the Google Analytics property being used by the experiment. Should follow the form `UA-XXXX-Y`. Different IDs should be used for different deployments (i.e. for dev, stage, and production).
- [`aip`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#aip) - this indicates that the IP address of the sender should be anonymized. Always `1`.
- [`ds`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ds) - this indicates the context from which the event is being reported. Should be `addon` if sent from an experiment’s add-on, `web` if sent from an associated web property, or `app` if sent from an associated mobile application.
- [`qt`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#qt) - if [batching](https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide#batch) or delaying reports, this should represent the time delta between the event happening and the time it is being reported. This should not exceed 4 hours. _(Optional)_
- [`z`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#z) - the unix timestamp of the event taking place, used for cache-busting.

### User Fields
- [`cid`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cid) - a [UUIDv4](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_.28random.29) that should be consistent across all events reported with this user. It should be stored with a persistent mechanism. If there is a sync component to the experiment, this should also be synced and be made consistent across clients and devices. This can be generated with [the `uuid` npm package](https://www.npmjs.com/package/uuid).

### Session
- [`ua`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ua) - the user agent, as reported by [`navigator.userAgent`](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorID/userAgent).

### System Info
- [`ul`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ul) - the user’s language, as reported by  [`navigator.language`](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/language).

### Hit
- [`t`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#t) - the type of hit. Usually `event` for Test Pilot usage.

### App Tracking Fields
- [`an`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#an) - the name of the Test Pilot experiment.
- [`aid`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#aid) - the add-on’s ID, if one exists. _(Optional)_
- [`av`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#av) - the add-on’s version number, if one exists. _(Optional)_
- [`aiid`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#aiid) - an indication of the location of the experiment. For most usage, should be  `testpilot`. This should be changed if shipping with [Shield](https://wiki.mozilla.org/Firefox/Shield) or in moz-central.

### Event Fields
For more information about the components of an event and best practices for doing so, see [Google’s documentation on events](https://support.google.com/analytics/answer/1033068) .

- [`ec`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ec) - the category of the event being reported.
- [`ea`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ea) - the action of the event being reported.
- [`el`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#el) - the event’s label. _(Optional)_
- [`ev`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ev) - the event’s value, as an integer. _(Optional)_

### Custom Dimension/Metric Fields
Google Analytics allows you to report [custom dimensions and metrics](https://support.google.com/analytics/answer/2709828?hl=en) with each event, up to 20 of each. Care should be taken in choosing these, given their limited number and inability to repurpose them once used. They are [defined in the property’s admin](https://support.google.com/analytics/answer/2709828?hl=en#configuration) before being used, and their definition and use are documented in each experiment’s repository.

- [`cd<index>`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cd_) - the value of custom dimension number `<index>`.
- [`cm<index>`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cm_) - the value of custom metric number `<index>`.

#### Global Custom Dimensions/Metrics
Some custom dimensions and metrics are used consistently across Test Pilot experiments. These use the highest index numbers possible, for consistency across reports. These are all required.

- `cd19` - indicates the release channel of the add-on. Should be one of `local`, `dev`, `stage`, or `production`.
- `cd20` - indicates the Firefox release channel. This can be reverse-engineered by comparing the user agent to [information from `product-details`](https://product-details.mozilla.org/1.0/). Should be one of `esr`, `release`, `beta`, `developer`, or `nightly`.

### Content Experiment Fields
- [`xid`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#xid) - the ID of the current experiment._(Optional)_
- [`xvar`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#xvar) - the name of the population to which the user belongs in the current experiment. _(Optional)_

## Content Experiments
By using the [content experiment fields](#content-experiment-fields), experiments are free to use Google Analytics’ [Content Experiments](https://support.google.com/analytics/answer/1745147?hl=en&ref_topic=1745207&visit_id=1-636335713647262387-4167257197&rd=1) for variant testing. Users may only belong to one experiment at a time.

Eventually, this section will include more specific information about the use of content experiments. See [bug 2537](https://github.com/mozilla/testpilot/issues/2537) for details.

## Visualization and Reporting
Eventually, this section will include information about the use of Data Studio to analyze and visualize collected data. See [bug 2539](https://github.com/mozilla/testpilot/issues/2539) for details.
