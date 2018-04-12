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

## Why is Test Pilot telling me that something went wrong?

If you've enabled `privacy.resistFingerprinting`, Firefox may be blocking add-on installation, and you will need to update your browser's configuration. To do so, do the following:
1. Go to `about:config`.
2. Right-click on the list of preferences, and select New > Boolean.
3. Enter `privacy.resistFingerprinting.block_mozAddonManager` as the preference name.
4. Enter `false` as the preference value.

Otherwise, please see the instructions below to file a bug.

## Where can I file a bug?

Test Pilot bugs can be filed on the Test Pilot GitHub repo. [link](https://github.com/mozilla/testpilot/issues)

You will find a link to report bugs for individual experiments on the experiment's detail page on [Test Pilot](https://testpilot.firefox.com/) for the most up to date link.

## Why do Test Pilot experiments ask me to allow Google Analytics?

Test Pilot uses GA event tracking to measure certain interactions within experiments. We use this data to better understand how participants are using experiments. Each experiment contains a summary description of what data we collect and a link to the precise schema definitions we send to GA. For example, here is the entire metrics schema for [Notes](https://github.com/mozilla/notes/blob/master/docs/metrics.md). We do not provide any Test Pilot data for use in Google's products & services.

If you're uncomfortable with submitting data to GA, all of our experiments respect the Do Not Track flag in `about:preferences`.

## What browsers are supported by Test Pilot?

While you can only install Test Pilot on Firefox, the site should render and work correctly in the following Contexts.

| Browser            | Support                              | Current | Issue |
|--------------------|--------------------------------------|---------|-------|
| Firefox            | Release, Release - 1, Beta, Nightly* | Green   |       |
| Chrome             | Current Release                      | Green   |       |
| Edge               | Current Release                      | Green   |       |
| Safari             | Current Release                      | Green   |       |
| Firefox iOS        | Current Release                      | Red     | [#2642](https://github.com/mozilla/testpilot/issues/2642) |
| Fennec             | Current Release                      | Green   |       |
| Chrome iOS         | Current Release                      | Green   |       |
| Safari iOS         | Current Release                      | Green   |       |
| Chrome for Android | Current Release                      | Green   |       |
| Focus iOS          | Current Release                      | Green   |       |
| Focus Android      | Current Release                      | Green   |       |
| IE                 | Not Supported                        |   ✌️     |       |

*Firefox Nightly may have bugs that are beyond our ability to support on any given day.

## Why not support ESR 52?

Firefox underwent some pretty radical changes for Firefox 57 that make supporting ESR 52 untenable for Test Pilot. We will revisit ESR support in 2018 when ESR is updated to Firefox 59.




