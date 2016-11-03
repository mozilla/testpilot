[👈 Back to README](../../README.md)

Test Pilot Add-on Environment
===============================

#Overview

Test Pilot has a few different environments. The purpose of these is for testing different functionality.

Below are the environments for the website:

| ENVIRONMENT | `testpilot.env` | URL |
|:------------|:----------------|:----|
| Local       | `local`         | http://testpilot.dev:8000/
| Development | `dev`           | https://testpilot.dev.mozaws.net/
| Stage       | `stage`         | https://testpilot.stage.mozaws.net/
| Production  | `production`    | https://testpilot.firefox.com/

Since the website talks to the add-on, it's important that the two environments are configured the same while testing, and developing.

#How to change your add-on environment

## about:config Method

1. Go to `about:config`
2. Edit the preference `testpilot.env` to one of these values:
  - `local`
  - `dev`
  - `stage`
  - `production`

## Fast Switcher Addon (Ground Control) Method

1. Ensure you've completed the installation and development steps from [`addon/README.md`](../addon/README.md)
2. Ensure you have the [Extension Auto-Installer](https://addons.mozilla.org/en-US/firefox/addon/autoinstaller/) add-on enabled.
3. In a terminal go to the `groundcontrol/` directory
4. Run `npm install` and `npm start`
5. You should now see a new button on your Firefox toolbar
6. Click the toolbar button and select a new icon to change the environment
  - from top to bottom they are: production, stage, dev, local

---

That's it! Now, click the Test Pilot add-on's toolbar button and you should see experiments from that environment
