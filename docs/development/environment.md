[👈 Back to README](../../README.md)

Test Pilot Add-on Environment
===============================

#Overview

Test Pilot has a few different environments. The purpose of these is for testing different functionality.

Below are the environments for the website:

| ENVIRONMENT | `testpilot.env` | URL |
|:------------|:----------------|:----|
| Local       | `local`         | https://example.com:8000/
| Development | `dev`           | https://testpilot.dev.mozaws.net/
| Stage       | `stage`         | https://testpilot.stage.mozaws.net/
| Production  | `production`    | https://testpilot.firefox.com/

Since the website talks to the add-on, it's important that the two environments are configured the same while testing, and developing.

#How to change your add-on environment

1. Go to `about:config`
2. Edit the preference `testpilot.env` to one of these values:
  - `local`
  - `dev`
  - `stage`
  - `production`
