# Test Pilot Deployment Verification Test Plan

## ENVIRONMENTS:

| ENVIRONMENT | URL |
|:------------|:----|
| Development | http://testpilot.dev.mozaws.net/
| Stage       | https://testpilot.stage.mozaws.net/
| Production  | https://testpilot.firefox.com/

## PREREQUISITES:

- Make sure your Developer Tools Console is open (for each browser), and verify that no unexpected messages (`console.log()`, CSP errors, SRI errors, etc) are logged to the console.

- Navigate to https://testpilot.firefox.com/__version__ (or desired environment) and verify the deployed Circle-CI build, commit SHA and version.

- Bonus points: Open your Browser Console (Firefox > Tools > Web Developer > Browser Console) and verify nothing odd is displayed from the Firefox firehose.


## TESTS:

### Chrome <small>(ETA: 1m)</small>

1. Open Google Chrome.

2. Go to https://testpilot.firefox.com/ (or desired environment).

3. Verify that Test Pilot renders as expected (no broken images, console messages, and prompts you to download Firefox to continue).

4. Click the **"Download"** button and verify you're taken to the Firefox download page.

### Legal <small>(ETA: 2m)</small>

1. Open Google Chrome (so we can verify the legal docs render in non-Firefox browsers as well).

2. Go to https://testpilot.firefox.com/ (or desired environment).

3. Scroll to the bottom of the page and click the **"Privacy"** link in the footer.

4. Verify that you're taken to https://testpilot.firefox.com/privacy page.

5. Expand both the **"Learn More"** sections and verify they expand/collapse as expected.

6. Scroll to the bottom of the page and click the **"Terms of Use"** button in the footer.

7. Verify that you're taken to the https://testpilot.firefox.com/terms page.

8. Scroll through the "big wall of text" and verify everything renders as expected.

9. Scroll to the top of the page and click the **"Firefox Test Pilot"** header image and verify you're taken back to the homepage.

### 404 <small>(ETA: 1m)</small>

1. Open Google Chrome (so we can verify the 404 pages render in non-Firefox browsers as well).

2. Go to http://testpilot.dev.mozaws.net/fourohfourohno (or desired environment).

3. Verify that you see the expected **"Four Oh Four!"** page with a link to the Home page.

4. Click the big, blue **"Home"** button.

5. Verify that you're taken back to the homepage (in this case http://testpilot.dev.mozaws.net/).

### Firefox <small>(ETA: 25m)</small>

1. Open Firefox (any channel, preferrably _Release_ or _Nightly_).

1. Go to **about:addons** and verify that you don't have any existing Test Pilot add-on or experiment add-ons installed.

1. Go to http://testpilot.dev.mozaws.net/ (or desired environment)

1. Verify you see a big, green **"Install the Test Pilot Add-on"** button, as well as the **"By proceeding, you agree to the _Terms of Use_ and _Privacy Notice_ of Test Pilot"** disclaimer beneath it.

1. Click both the legal buttons (**"Terms of Use"**, and **"Privacy Notice"**) and verify they render correctly.

1. Scroll to the bottom of the page and verify you see the same green button and legal disclaimer as at the top of the page.

1. Click the green **"Install the Test Pilot Add-on"** button. (You may get a door-hanger saying **"Firefox prevented this site from asking you to install software on your computer."** dialog. Click the **"Allow"** button.)

1. Click the **"Install"** button in the door-hanger.

1. Verify that you see a Test Pilot door-hanger on the right side of the browser, as well as a Test Pilot spaceship logo in the main toolbar. You should also see a **"Test Pilot installed!"** page with a green button saying **"Choose your features"**.

1. Click the Test Pilot icon in the toolbar and verify the door-hanger appears and lists the available experiments (none of which should be enabled if you're testing on a clean profile).

1. Hover over each of the experiments (and View all experiments button) in the door-hanger from the previous step and verify the URLs have `?utm_` codes.

1. Click the **"Choose your features"** button on the main site, and verify that you're redirected to the http://testpilot.dev.mozaws.net/experiments page.

1. Go to **about:addons** in a new tab, switch to the Extensions section and look for the **Test Pilot** add-on. Verify that the Test Pilot spaceship icon appears in the list and click the **"Preferences"** button. Verify that the add-on version information matches the information on the http://testpilot.dev.mozaws.net/__version__ page. Verify that the **Environment** dropdown value matches your current server environment. Go back to the Test Pilot site.

1. Click on any of the active experiments (ie: Activity Stream) and verify you are taken to the experiment details page.

1. Click the **[...]** button at the top of the page and verify that your current logged in account is displayed, and click each of the three links at the top (**"Test Pilot Wiki"**, **"Discuss Test Pilot"**, and **"File an Issue"**) open the expected URLs. Clicking the **"Sign out"** with unsurprisingly sign you out of your session, and clicking the **"Uninstall Test Pilot"** link will bring up a confirmation dialog asking you if you want to uninstall Test Pilot and uninstall all your active experiments.

1. Click the **"Uninstall Test Pilot"** button in the drop down menu and confirm the text. Click the **"Cancel"** link at the bottom to dismiss the dialog without removing the Test Pilot add-on and all your active experiments (we'll verify this below).

1. Quickly verify that the data looks right-ish. Note that each environment (dev, stage, prod) has different content and descriptions, versions, contributors may all be wildly different between server environments.

1. Scroll down the page and verify that the experiment name and Enable/Disable buttons are "sticky".

1. Assuming the currently visible experiment is NOT active, click the **"Your privacy"** link up in the sticky header area.

1. Verify that the **"Your privacy"** section is briefly highlighted and fades out after a couple seconds.

1. Click the link in the **"Your privacy"** section to view the experiment's data collection policy (make sure it doesn't 404, and is readable and now just raw Markdown).

1. Click the **"Enable {experiment name}"** button to enable the current experiment.
    - In the case of **Activity Stream**, you should see a new icon appear in your toolbar, and clicking **"New Tab"** button will take you to a new homepage showing your recent browsing activity.
    - In the case of **Tab Center**, you should see your top tabs disappear and reappear on the left hand side.
    - In the case of **Universal Search** you should see a new search UI in the Awesome Bar if you search for a movie or something on Wikipedia.

1. After the experiment is successsfully installed, verify that a dialog box appears saying **"{Experiment name} enabled!"**. Click the **"Take the Tour"** button and verify the tour works and closes as expected. Confirm that after installing the experiment, the number of active users increases by 1.

1. After enabling an experiment, the header area should now say **"Active"** in green (Note that the Active will not be visible if your header area is currently "sticky").

1. Make sure clicking the blue **"Give Feedback"** button takes you to a Survey Gizmo page which asks you to rate the experiment and give some feedback (in a new tab). Leave some feedback or close the tab and return to Test Pilot.

1. Click the Test Pilot icon in the toolbar and verify that the currently active experiment is listed as **"Now Active"** and has a green checkbox.

1. Click the **"View all experiments"** button in the Test Pilot doorhanger and verify that you're taken to the http://testpilot.dev.mozaws.net/experiments page and your currently active experiments have a green outline (with a checkbox), and the button at the bottom of the experiment card has a gray **"Manage"** button instead of a blue **"Get Started"** button.

1. Select a new (non-active) experiment from the Test Pilot toolbar doorhanger, and click the blue **"Enable {experiment name}"** button from the experiment details page.

1. Click the Test Pilot icon in the toolbar and verify that both active experiments are listed as **"Now Active"**.

1. Go back to the original Test Pilot exeriment details page and click the gray **"Disable {experiment name}"** button. Verify that the number of active experiment users decreases by 1.

1. Verify that you see a **"Thank You!"** modal dialog which has an icon and thanks the user for their participation, and has two buttons:
    - a blue **"Take a quick survey"** button
    - a **"Close"** link

1. Click the **"Take a quick survey"** button and verify that you're taken to a Survey Gizmo page (in a new tab) for the recently deactivated experiment.

1. Leave some feedback, or close the newly opened tab.

1. Return to the recently deactivated experiment details page and verify that the experiment is no longer enabled and you see a blue **"Enable {experiment name}"** button, and clicking the Test Pilot button in the toolbar no longer lists the experiment as active.

1. Make sure you have at least ONE active experiment and click the **[...]** button in the header area.

1. Click the **"Sign out"** link and verify you're redirected back to http://testpilot.dev.mozaws.net/ and you're prompted to **"Get started with a Firefox Account"** again. Note that you won't be asked to confirm if you want to sign out and you'll be signed out immediately.

1. Go to **about:addons** and verify that your Test Pilot add-on is still installed+active, as well as any experiments you had previously installed. If you had Tab Center previously installed, it should still be active and working, even though you're no longer signed in to the Test Pilot website.

1. Sign back in to Test Pilot using the same account as you were using previously.

1. Click the **[...]** button in the header area.

1. Click the **"Uninstall Test Pilot"** link in the pop-up menu.

1. Verify that you're prompted to uninstall test pilot and given the option of proceeding (a big, scary red button), or cancelling (a non-threatening blue link). Clicking the Cancel button takes you back to safetly. Clicking the scary red button will uninstall the Test Pilot add-on and any experiments you have currently installed.

1. Click the red **"Proceed"** button to leave the Test Pilot program. You should see a **"Shutting down"** spinner and then a **"Thanks for flying!"** modal dialog thanking you for your participaction and prompting you to **"Take a quick survey"** or returning to the Home page.

1. Click the blue **"Take a quick survey"** and you should be redirected to a Survey Gizmo page in a new tab. Leave some feedback or close the tab.

1. Click the **"Home"** link.

1. You should be back a the http://testpilot.dev.mozaws.net/ page and no longer be signed in. Verify that you no longer see the Test Pilot icon in the toolbar.

1. Go to **about:addons** and verify that you have no add-ons installed in the Extensions tab.
    - If you previously had the **Activity Stream** experiment installed and active, clicking "New Tab" should no longer show the Activity Stream experiment or beautiful new tab page.
    - If you previously had the **Tab Center** add-on installed and active, your side tabs should have reverted back to the top, as they were before you installed the experiment.
    - If you previously had the **Universal Search** add-on installed and active, your Awesome Bar search behavior should have reverted back to its previous, default behavior.
