<img src="frontend/src/app/components/Copter/img/copter.png" alt="Test Pilot Logo" width="328" height="265">  

# Test Pilot

Test Pilot is an opt-in platform that allows us to perform controlled tests of new high-visibility product concepts in the general release channel of Firefox.

Test Pilot is not intended to replace trains for most features, nor is it a test bed for concepts we do not believe have a strong chance of shipping in general release. Rather, it is reserved for features that require user feedback, testing and tuning before they ship with the browser.

[![Build](https://img.shields.io/circleci/project/mozilla/testpilot.svg)](https://circleci.com/gh/mozilla/testpilot/)
[![codecov](https://codecov.io/gh/mozilla/testpilot/branch/master/graph/badge.svg)](https://codecov.io/gh/mozilla/testpilot)

---

## Table of Contents

- Developing Test Pilot
    - [Quickstart](docs/development/quickstart.md) - Get your development environment working.
    - [Testing](docs/development/testing.md) - Automated testing.
    - [Storybook](docs/development/storybook.md) - Interactive development & testing for UI components.
    - [Add-on](addon/README.md) - Working on the Test Pilot add-on.
    - [Add-on environment](docs/development/environment.md) - Configuring to which server the add-on connects.
    - [Variants](docs/development/variants.md) - Creating variant tests on the Test Pilot website.
    - [Deployment](docs/development/deployment.md) - Deploying Test Pilot to staging and production
    - [Dev Deployment](docs/development/dev-deployment.md) - Deploying Test Pilot to the dev environment
    - [Verifying deployments](docs/development/verification.md) - Verifying Test Pilot deployments.
- Developing experiments
    - [Recommended process](docs/experiments/developing_an_experiment.md) 
    - [Experiment metrics](docs/experiments/ga.md) - The use of Google Analytics to track experiment data.
    - [Experiment Feedback Integration](docs/examples/feedback-buttons.md)
- Metrics
    - [Google Analytics](docs/metrics/ga.md) - How we use Google Analytics.
    - [New features](docs/metrics/new_features.md) - Everything needed to instrument something new.
- [Experiment content](docs/content/reference.md) - Management of experiment content.
- [Graduating experiments](docs/content/graduation.md) - Graduation of old experiments.
- [Process](docs/process.md) - How we create, triage, and assign work.
- [FAQ](docs/faq.md)
- [Contributing to Test Pilot](CONTRIBUTING.md)
- [Code of conduct](docs/code_of_conduct.md)
- [License](LICENSE)

---

## Localization

Test Pilot localization is managed via [Pontoon](https://pontoon.mozilla.org/projects/test-pilot-website/), not direct pull requests to the repository. If you want to fix a typo, add a new language, or simply know more about localization, please get in touch with the [existing localization team](https://pontoon.mozilla.org/teams/) for your language or Mozilla’s [l10n-drivers](https://wiki.mozilla.org/L10n:Mozilla_Team#Mozilla_Corporation) for guidance.

---

## More Information

- Wiki: https://wiki.mozilla.org/Test_Pilot
- IRC: #testpilot on irc.mozilla.org

---

<img src="https://avatars2.githubusercontent.com/u/131524?s=200&v=4" width="50"></img>
