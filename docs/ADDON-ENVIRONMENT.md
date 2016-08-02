Test Pilot Add-on Environment
===============================

#Overview

Test Pilot has a few different environments. The purpose of these is for testing different functionality.

Below are the environments for the website:

| ENVIRONMENT | URL |
|:------------|:----|
| Development | http://testpilot.dev.mozaws.net/
| Stage       | https://testpilot.stage.mozaws.net/
| Production  | https://testpilot.firefox.com/

Since the website talks to the add-on, it's important that the two environments are configured the same while testing, and developing.

#How to change your add-on environment

Step 1: Go to `about:addons`
![about:addons](https://d3vv6lp55qjaqc.cloudfront.net/items/2i191e3i1W3N0a3x1R2J/Image%202016-08-02%20at%2012.17.55%20PM.png?v=ed3f9d5d)
Step 2: Find the Test Pilot add-on under `Extensions` and click `Preferences`
![Preferences](https://d3vv6lp55qjaqc.cloudfront.net/items/0s1W1U081x1d2b0w1T3O/Image%202016-08-02%20at%2012.17.55%20PM.png?v=559c11a6)
Step 3: Click on the dropdown box next to `Environment`, and select the appropriate value
![Environment](https://d3vv6lp55qjaqc.cloudfront.net/items/0v2J113l2D411J1t0n2G/Image%202016-08-02%20at%2012.25.15%20PM.png?v=14a4f2e4)
![Values](https://d3vv6lp55qjaqc.cloudfront.net/items/3N0s0m0M3B0a1y04332D/Image%202016-08-02%20at%2012.26.32%20PM.png?v=04e02604)

That's it! Once you move focus from the dropdown, your environment will be updated.
