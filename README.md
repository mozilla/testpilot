![Test Pilot Logo](frontend/src/images/copter.png)

# Test Pilot

Test Pilot is an opt-in platform that allows us to perform controlled tests of new high-visibility product concepts in the general release channel of Firefox.

Test Pilot is not intended to replace trains for most features, nor is it a test bed for concepts we do not believe have a strong chance of shipping in general release. Rather, it is reserved for features that require user feedback, testing, and tuning before they ship with the browser.

[![Build](https://img.shields.io/circleci/project/mozilla/testpilot.svg)](https://circleci.com/gh/mozilla/testpilot/)
[![codecov](https://codecov.io/gh/mozilla/testpilot/branch/master/graph/badge.svg)](https://codecov.io/gh/mozilla/testpilot)

## Table of Contents

- Developing Test Pilot
    - [Quickstart](docs/development/quickstart.md) - Get your development environment working.
    - [Add-on](addon/README.md) - Working on the Test Pilot add-on.
    - [Testing](docs/development/testing.md) - Automated testing.
    - [Variants](docs/development/variants.md) - Creating variant tests on the Test Pilot website.
    - [Deployment](docs/development/deployment.md) - Deploying Test Pilot to staging and production
    - [Dev Deployment](docs/development/dev-deployment.md) - Deploying Test Pilot to the dev environment
    - [Verifying deployments](docs/development/verification.md) - Verifying Test Pilot deployments.
    - [Add-on environment](docs/development/environment.md) - Configuring to which server the add-on connects.
- Developing experiments
    - [Experiment metrics](docs/experiments/ga.md) - The use of Google Analytics to track experiment data.
    - [Variant testing](docs/experiments/variants.md) - Creating variant (e.g. A/B) tests in experiments.
    - [Example experiments](docs/experiments/)
- Metrics
    - [Telemetry](docs/metrics/telemetry.md) - How we use Firefox telemetry.
    - [Google Analytics](docs/metrics/ga.md) - How we use Google Analytics.
    - [New features](docs/metrics/new_features.md) - Everything needed to instrument something new.
- [Experiment content](docs/content/reference.md) - Management of experiment content.
- [Process](docs/process.md) - How we create, triage, and assign work.
- [FAQ](docs/faq.md)
- [Contributing to Test Pilot](CONTRIBUTING.md)
- [Code of conduct](docs/code_of_conduct.md)
- [License](LICENSE)

## Localization

Test Pilot localization is managed via [Pontoon](https://pontoon.mozilla.org/projects/test-pilot-website/), not direct pull requests to the repository. If you want to fix a typo, add a new language, or simply know more about localization, please get in touch with the [existing localization team](https://pontoon.mozilla.org/teams/) for your language, or Mozilla’s [l10n-drivers](https://wiki.mozilla.org/L10n:Mozilla_Team#Mozilla_Corporation) for guidance.

## More Information

- Wiki: https://wiki.mozilla.org/Test_Pilot
- IRC: #testpilot on irc.mozilla.org
