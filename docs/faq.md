[👈 Back to README](../README.md)

# FAQ

## Why does Test Pilot require JavaScript?

- We use JavaScript to render the user interface of Test Pilot.
- We use JavaScript to manage experiment installations.
- We use JavaScript to collect data to help us improve Test Pilot in accordance with our [Terms of Use](https://testpilot.firefox.com/terms) and [Privacy Notice](https://testpilot.firefox.com/privacy).

Since Test Pilot is an open source project, you can see all of the cool ways we use JavaScript by [examining our code](https://github.com/mozilla/testpilot/).

## Why isn't a Test Pilot icon showing up in my toolbar?

Test Pilot can't be installed in [private browsing mode](https://support.mozilla.org/en-US/kb/private-browsing-use-firefox-without-history?redirectlocale=en-US&redirectslug=Private+Browsing), 
and if you have it installed already, it is disabled in private browsing mode.

## Does Test Pilot work in private browsing mode?

Not right now, but we're thinking about changing that. For background discussion, see this issue: [#1504](https://github.com/mozilla/testpilot/issues/1504).

## Why won't Test Pilot/experiments install?

Make sure your Test Pilot add-on is up-to-date. You might try uninstalling and installing Test Pilot if nothing else works. For more details, see discussion in issue [#1474](https://github.com/mozilla/testpilot/issues/1474)

## How can I contribute?

First, you will want to take a look at our [CONTRIBUTING.md](https://github.com/mozilla/testpilot/blob/master/CONTRIBUTING.md) file.

If you want to be part of the discussion, you can checkout the [Test Pilot category](https://discourse.mozilla-community.org/c/test-pilot) on the [Mozilla Discourse forum](https://discourse.mozilla-community.org). You will find subcategories for individual experiments here as well.

If you'd like to contribute to an experiment, take a look at the experiment's detail page on [Test Pilot](https://testpilot.firefox.com/) for the most up to date link to the experiment's repository.

## I used to see an experiment, but now it's missing?

We've recently shipped localization for Test Pilot and decided to restrict experiments from certain locales to ensure a smooth roll out. We didn't uninstall any experiments, but if your default language is German, some experiments may have been hidden from Test Pilot. 
Experiments you've previously installed are still accessible through `about:addons` and can be uninstalled from there. It's also possible that the experiment you're looking for has already graduated.
You can see graduated experiments by clicking on the `View Past Experiments` button on [Test Pilot](https://testpilot.firefox.com/).

## Where can I file a bug?

Test Pilot bugs can be filed on the Test Pilot GitHub repo. [link](https://github.com/mozilla/testpilot/issues)

You will find a link to report bugs for individual experiments on the experiment's detail page on [Test Pilot](https://testpilot.firefox.com/) for the most up to date link.
