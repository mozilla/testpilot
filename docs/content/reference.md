[👈 Back to README](../../README.md)

Experiment content is managed with a series of YAML files in the `content-src` directory. At build time, the YAML is converted to JSON, which the website loads at runtime.


# New experiments

To make a new experiment:

1. Copy the `template.yaml` file below into `./content-src/experiments`
2. Rename your file to match the eventual slug of your experiment eg `tab-center.yaml`
3. You'll need a place to put image assets for your experiment. Make a new directory './frontend/src/images/experiments' to match the name of your yaml file
4. In the directory you've created, `mkdir details social avatars tour icon`. You'll put various image assets into these folders.
5. As you add images, please compress them. You can do this with an [app](https://imageoptim.com/mac) or [command line tool](https://www.npmjs.com/package/image-min).
6. Populate the content as appropriate, using the [reference](#reference) to help.


# Localization

An experiment's YAML file is considered to contain the canonical localization for English, and is compiled into [an FTL file](https://testpilot.dev.mozaws.net/static/locales/en-US/experiments.ftl) with each build. That file is monitored by Pontoon, and strings are translated by volunteer localizers.

For new experiments, you must copy the build version from `frontend/build/static/locales/en-US/experiments.ftl` to `locales/en-US/experiments.ftl`, and include it in the pull request (ref #1781).

If the content of a string changes sufficiently that translations of it should be invalidated:

1. Make sure that this change needs to be done. We rely on volunteer localizers, 
2. If at all possible, wait to make the change until the beginning of a sprint to give localizers time to translate the new string before the next deployment.
3. Add a new field to the YAML titled `<fieldname>_l10nsuffix`, set to a short string contextualizing the change.

For example: if we decide to rename the "Activity Streams" experiment to "Activity Stream", the following YAML:

```yaml
title: 'Activity Streams'
```

Would be changed to this:

```yaml
title: 'Activity Stream'
title_l10nsuffix: 'singular'
```

This change will turn the `l10n-id` from `activitystreamTitle` to `activitystreamTitleSingular`, treating it as an entirely new string and invalidating all existing translations.

This also works for nested properties:

```yaml
contributors:
  -
      display_name: 'Jared Hirsch'
      title: 'Staff Engineer'
      title_l10nsuffix: 'staff'
      
```


# Reference

The following YAML fields are available to content authors:


## `id`

A unique numeric ID for the experiment. This is being incremented sequentially, so check previous experiments to determine what this value should be. Required.

```yaml
id: 0
```


## `slug`

A slugified version of the title, used to generate URLs. Required.

```yaml
slug: 'experiment-name'
```


## `title`

The name of the experiment. Localized, required.

```yaml
title: 'Experiment Name'
```


## `subtitle`

A subtitle for the experiment, generally used for attribution of an experiment to a partner. Localized, optional.

```yaml
subtitle: 'Powered by a yellow submarine'
```

![Example use of subtitle](img/subtitle.png)


## `order`

The order in which the experiment will appear. Lower numbers appear first. Required.

```yaml
order: 0
```

## `description`

A short description of the experiment, used for search engines, social media shares, and in the experiment card. Localized, required, HTML not allowed.

```yaml
description: >
  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum cum ad deserunt
  iusto possimus. Fugiat odit corrupti cumque.
```

![Example Twitter share with description](img/description.png)


## `introduction`

A short introduction of the experiment, displayed on top of the experiment detail page. Required, localized, HTML required.

```yaml
introduction: >
  <p>Lorem ipsum dolor sit amet.</p>
  <p>Consectetur adipisicing elit.</p>
```

![Example use of introduction](img/introduction.png)


## `image_twitter`

A representative image to be used when being shared on Twitter. Should be a 560x300 JPG. Required.

```yaml
image_twitter: '/static/images/experiments/experiment-name/twitter.jpg'
```

![Example share on Twitter with image](img/image_twitter.png)


## `image_facebook`

A representative image to be used when being shared on Facebook. Should be a 1200x630 JPG. Required.

```yaml
image_facebook: /static/images/experiments/experiment-name/facebook.jpg
```

![Example share on Facebook with image](img/image_facebook.png)


## `thumbnail`

The root absolute path to where the image will be served. Should be a 192x192 PNG with 24-bit transparency, using only white. Required.

```yaml
thumbnail: '/static/images/experiments/experiment-name/thumbnail.png'
```

![Example thumbnail](img/thumbnail.png)


## `gradient_start`

The upper-left color of the gradient displayed in front of the thumbnail image. Required.

```yaml
gradient_start: '#111111'
```

![Example thumbnail](img/thumbnail.png)


## `gradient_stop`

The bottom-right color of the gradient displayed behind the thumbnail image. Required.

```yaml
gradient_stop: '#222222'
```

![Example thumbnail](img/thumbnail.png)


## `xpi_url`

The URL to the Test Pilot-hosted XPI file. Required.

```yaml
xpi_url: 'https://testpilot.firefox.com/files/experiment-name/latest'
```


## `addon_id`

The add-on ID from the experiment manifest. Required.

```yaml
addon_id: 'experiment-name@mozilla.com'
```


## `created`

UTM-formatted date indicating the official launch of the experiment. Used to calculate labels like "Just launched". Required.

```yaml
created: '2016-01-01T00:00:00.000000Z'
```


## `completed`

UTM-formatted date indicating the time the experiment will be retired. Used to calculate labels like "Ending Soon". Optional. Note: should include timezone to ensure experiment completes at the same time everywhere.

```yaml
completed: '2016-01-01T00:00:00.000000Z'
```


## `launch_date`

UTM-formatted date indicating the time at which the experiment should be displayed in production. Use this to time experiment launches with marketing campaigns. Optional.

```yaml
launch_date: '2016-01-01T00:00:00.000000Z'
```


## `changelog_url`

The URL to the experiment's changelog. Displayed in the sidebar. Required.

```yaml
changelog_url: 'https://www.github.com/mozilla/experiment-name/blob/master/docs/changelog.md'
```

![Example usage of changelog URL](img/urls.png)


## `contribute_url`

The URL to the code repository for the experiment. Displayed in the sidebar. Required.

```yaml
contribute_url: 'https://www.github.com/mozilla/experiment-name'
```

![Example usage of contribute URL](img/urls.png)


## `bug_report_url`

The URL to the experiment's issue tracker. Displayed in the sidebar. Required.

```yaml
bug_report_url: 'https://www.github.com/mozilla/experiment-name/issues'
```

![Example usage of bug report URL](img/urls.png)


## `discourse_url`

The URL to the experiment's Discourse forum. Displayed in the sidebar. Required.

```yaml
discourse_url: 'https://discourse.mozilla-community.org/c/test-pilot/experiment-name'
```

![Example usage of Discourse URL](img/urls.png)


## `privacy_notice_url`

The URL to the experiment's metrics documentation. Displayed beneath the measurement disclaimer. Required.

```yaml
privacy_notice_url: 'https://www.github.com/mozilla/experiment-name/blob/master/docs/metrics.md'
```

![Example usage of privacy notice URL](img/privacy_notice_url.png)


## `details`

An array of one or more image + caption pairs, listed on the experiment detail page. Each one should contain:

- `headline` - Bold text to display at the beginning of the caption. Optional, HTML not allowed.
- `image` - The URL to the image. Should be 1280px wide and 720-1080px tall. Required.
- `copy` - A caption for the image. Localized, required, HTML not allowed.

```yaml
details:
  -
    headline: 'Lorem ipsum'
    image: /static/images/experiments/experiment-name/details-1.jpg
    copy: >
      dolor sit amet, consectetur adipisicing elit. Ipsum cum ad deserunt
      iusto possimus. Fugiat odit corrupti cumq ue.
```

![Example detail image](img/details.png)


## `contributors`

An array of one or more contributors to the experiment, listed on the experiment detail page. Each one should contain:

- `display_name` - The contributor's name. Required.
- `title` - The contributor's title. Localized, optional.
- `avatar` - The URL to an avatar for the contributor. Should be 64x64. Required.

```yaml
contributors:
  -
    display_name: 'Tom Pizza'
    title: 'Taco Engineer'
    avatar: /static/images/experiments/experiment-name/burrito.png
```

![Example contributor](img/contributors.png)


## `contributors_extra`

If your experiment non-enumerable legacy contributions, use this field to call them out. Optional. Localized.

```yaml
contributors_extra: >
    This experiment is based on Firefox Tracking Protection technology built by Mozilla employees
    and contributors over the past several years.
```
![Example Contrib Extra](img/contrib_extra.png)

## `contributors_extra_url`

If your experiment contains a `contributors_extra` section, you can optionally pass in a URL for a **learn more** link.

```yaml
contributors_extra: 'https://example.com'
```

## `tour_steps`

An array of one or more steps to a tour presented to users after instsalling the experiment. Each one should contain:

- `image` - The URL to an image. Should be 1280x720. Required.
- `copy` - A caption for the image. Should be wrapped in `<p>` tags. Localized, required, HTML allowed.

```yaml
tour_steps:
  -
    image: /static/images/experiments/experiment-name/tour-1.jpg
    copy: >
      <p>Lorem ipsum dolor sit amet.</p>
```

![Example tour step](img/tour_steps.png)


## `measurements`

A description of the measurements collected by the experiment. Displayed in the sidebar. Localized, required, HTML allowed.

```yaml
measurements: >
  <p>In addition to the <a href="/privacy">data</a> collected by all Test Pilot
    experiments, here are the key things you should know about what is happening
    when you use Experiment Name:</p>
  <ul>
    <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam atque accusamus,
      suscipit, nam commodi excepturi error modi. Laborum eum, quae, alias facere,
      cupiditate vitae praesentium eveniet unde totam, architecto molestiae?</li>
  </ul>
```

![Example measurements section](img/measurements.png)


## `pre_feedback_image`

If the experiment collects feedback directly, a modal window similar to the experiment tour is shown before the user goes to the feedback form. This is the image shown when that happens.

Should be 1280x720. Optional, required if `pre_feedback_copy` is set.

```yaml
pre_feedback_image: /static/images/experiments/experiment-name/pre-feedback.jpg
```

![Example pre-feedback prompt](img/pre-feedback.png)


## `pre_feedback_copy`

If the experiment collects feedback directly, a modal window similar to the experiment tour is shown before the user goes to the feedback form. This is the caption of the image in that prompt.

Should be wrapped in `<p>` tags. Localized, optional, required if `pre_feedback_image` is set, HTML allowed.

```yaml
pre_feedback_copy: >
  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam atque accusamus,
    suscipit, nam commodi excepturi error modi.</p>
```

![Example pre-feedback prompt](img/pre-feedback.png)

## `graduation_report`

When an experiment graduates, the following replaces the introduction and detail images sections on the experiment details page.

Should be wrapped in html tags. [While not yet localized, we may retain a l10n agency to localize as needed](https://github.com/mozilla/testpilot/issues/1829).
Generally optional, but required before the experiment graduates.

```yaml
graduation_report: >
  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam atque accusamus,
    suscipit, nam commodi excepturi error modi.</p>
    <ul>
    <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam atque accusamus,
      suscipit, nam commodi excepturi error modi. Laborum eum, quae, alias facere,
      cupiditate vitae praesentium eveniet unde totam, architecto molestiae?</li>
  </ul>
```


## `notifications`

An array of push notifications sent to the user to alert them of new content related to the experiment. Optional. Each should contain:

- `id` - a sequential identifier for the notification. Required.
- `title` - the notification title. Required, HTML not allowed.
- `text` - text of the notification. Required, HTML not allowed.
- `notify_after` - UTM-formatted date after which the notification should be displayed. Required.

```yaml
notifications:
  -
    id: 1
    title: 'Hey, listen!'
    text: 'Would you like to talk to Saria?'
    notify_after: '2016-01-01T00:00:00Z'
```

![Example notification on macOS](img/notifications.png)

## `eol_warning`

When your experiement is ending, add this field to idicate to users what will happen next. 

Localized, required when you add a `completed` field.

```yaml
eol_warning: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
```

![EOL Warning](img/eol_warning.png)

## `min_release`

The minimum version of Firefox with which this experiment is compatible. If the user is browsing with a version lower than this number, an incompatibility notice is displayed. Optional. 

```yaml
min_release: 99
```

![Warning shown to users with incompatible versions of Firefox](img/min_release.png)


## `incompatible`

A hash of add-ons incompatible with the experiment, mapping add-on ID to its name. If the user has one of these installed and enabled, a warning is displayed to them. Optional.

```yaml
incompatible:
  '@fake-incompatible': 'Fake Incompatible Add-on Name'
```

![Warning shown to users with incompatible add-ons installed and enabled](img/incompatible.png)


## `locales`

An array of locales without region codes in which the experiment is localized. If defined and the user's first language preference is not in this list, a warning is displayed. Optional.

```yaml
locales:
  - 'en'
```

![Warning shown to users viewing an experiment not localized in their top language preference](img/locales.png)


## `locale_blocklist`

An array of locales without region codes from which the experiment should be hidden. If defined and the user's first language preference is not in this list, the experiment will be hidden on the site. Optional.

```yaml
locale_blocklist:
  - 'de'
```


## `locale_grantlist`

An array of locales without region codes in which the experiment should be allowed. If defined and the user's first language preference is in the list, the experiment will be available on the site. Optional.

```yaml
locale_grantlist:
  - 'de'
```


## `dev`

A boolean indicating whether this experiment should only appear in a dev environment, i.e. for testing or localization. Required.

```yaml
dev: false
```
