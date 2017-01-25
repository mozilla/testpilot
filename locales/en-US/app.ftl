siteName = Firefox Test Pilot

# Page titles, put in the <title> HTML tag.
[[pageTitle]]
pageTitleDefault = Firefox Test Pilot
pageTitleLandingPage = Firefox Test Pilot
pageTitleExperimentListPage = Firefox Test Pilot - Experiments
pageTitleExperiment = Firefox Test Pilot - {$title}

# Links in the footer.
[[footerLink]]
footerLinkCookies = Cookies
footerLinkPrivacy = Privacy
footerLinkTerms = Terms
footerLinkLegal = Legal
footerLinkAbout = About Test Pilot

# Items in the menu.
[[menu]]
home = Home
menuTitle = Settings
menuWiki = Test Pilot Wiki
menuDiscuss = Discuss Test Pilot
menuFileIssue = File an Issue
menuRetire = Uninstall Test Pilot

# The splash on the homepage.
[[landing]]
landingIntroLead = Go beyond . . .
landingIntroOne = Test new features.
landingIntroTwo = Give your feedback.
landingIntroThree = Help build Firefox.
landingLegalNotice = By proceeding, you agree to the <a>Terms of Use</a> and <a>Privacy Notice</a> of Test Pilot.
landingExperimentsTitle = Try out the latest experimental features

# Related to the installation of the Test Pilot add-on.
[[landingInstall]]
landingInstallButton = Install the Test Pilot Add-on
landingInstallingButton = Installing...
landingInstalledButton = Choose your features

# Related to a one click to install test pilot and an experiment.
[[oneClickInstall]]
oneClickInstallMinorCta = Install Test Pilot &amp;
oneClickInstallMajorCta = Enable {$title}

# Homepage messaging for users not on Firefox or with an old version of Firefox.
[[landingFirefox]]
landingRequiresDesktop = Test Pilot requires Firefox for Desktop on Windows, Mac or Linux
landingDownloadFirefoxDesc = (Test Pilot is available for Firefox on Windows, OS X and Linux)
landingUpgradeDesc = Test Pilot requires Firefox 45 or higher.
landingDownloadFirefoxTitle = Firefox
landingUpgradeFirefoxTitle = Upgrade Firefox
landingDownloadFirefoxSubTitle = Free Download

# A section of the homepage explaining how Test Pilot works.
[[landingCard]]
landingCardListTitle = Get started in 3, 2, 1
landingCardOne = Get the Test Pilot add-on
landingCardTwo = Enable experimental features
landingCardThree = Tell us what you think

# Shown after the user installs the Test Pilot add-on.
[[onboarding]]
onboardingMessage = We put an icon in your toolbar so you can always find Test Pilot.

# Error message pages.
[[error]]
errorHeading = Whoops!
errorMessage = Looks like we broke something. <br> Maybe try again later.
notFoundHeader = Four Oh Four!

# A modal prompt to sign up for the Test Pilot newsletter.
[[emailOptIn]]
emailOptInDialogTitle = Welcome to Test Pilot!
emailOptInMessage = Find out about new experiments and see test results for experiments you've tried.
emailValidationError = Please use a valid email address!
# LOCALIZATION NOTE: The ':)' characters in the emailOptInInput placeholder are a smiley face emoticon.
emailOptInInput =
  [html/placeholder] email goes here :)
emailOptInButton = Sign me up
emailOptInSkip = Skip
emailOptInConfirmationTitle = Email Sent
emailOptInSuccessMessage2 = Thank you!
emailOptInConfirmationClose = On to the experiments...

# A listing of all Test Pilot experiments.
[[experimentsList]]
experimentListEnabledTab = Enabled
experimentListJustLaunchedTab = Just Launched
experimentListJustUpdatedTab = Just Updated
experimentListEndingTomorrow = Ending Tomorrow
experimentListEndingSoon = Ending Soon
experimentsListCondensedHeader = Pick your experiments!

# An individual experiment in the listing of all Test Pilot experiments.
[[experimentCard]]
experimentCardManage = Manage
experimentCardGetStarted = Get Started
experimentCardLearnMore = Learn More

# A modal prompt shown when a user disables an experiment.
[[feedback]]
feedbackSubmitButton = Take a quick survey
feedbackCancelButton = Close
feedbackUninstallTitle = Thank You!
feedbackUninstallCopy =
    | Your participation in Firefox Test Pilot means
    | a lot! Please check out our other experiments,
    | and stay tuned for more to come!

# A modal prompt shown before the feedback survey for some experiments.
[[experimentPreFeedback]]
experimentPreFeedbackTitle = {$title} feedback
experimentPreFeedbackLinkCopy = Give feedback about the {$title} experiment

# A splash shown on top of the experiment page when Test Pilot is not installed.
[[experimentPromo]]
experimentPromoHeader = Ready for Takeoff?
experimentPromoSubheader = We're building next-generation features for Firefox. Install Test Pilot to try them!

# The experiment detail page.
[[experimentPage]]
isEnabledStatusMessage = {$title} is enabled.
installErrorMessage = Uh oh. {$title} could not be enabled. Try again later.
participantCount = <span>{$installation_count}</span> participants
otherExperiments = Try out these experiments as well
giveFeedback = Give Feedback
disableHeader = Disable Experiment?
disableExperiment = Disable {$title}
disableExperimentTransition = Disabling...
enableExperiment = Enable {$title}
enableExperimentTransition = Enabling...
measurements = Your privacy
experimentPrivacyNotice = You can learn more about the data collection for {$title} here.
contributorsHeading = Brought to you by
contributorsExtraLearnMore = Learn more
changelog = Changelog
tour = Tour
tourLink = Launch Tour
contribute = Contribute
bugReports = Bug Reports
discussExperiment = Discuss { $title }
tourOnboardingTitle = {$title} enabled!
tourDoneButton = Done
userCountContainer = There are <span>{$installation_count}</span> people trying {$title} right now!
userCountContainerAlt = Just launched!
highlightPrivacy = Your privacy

# Shown when an experiment requires a version of Firefox newer than the user's.
[[upgradeNotice]]
upgradeNoticeTitle = {$title} requires Firefox {$min_release} or later.
upgradeNoticeLink = How to update Firefox.

# Shown while uninstalling Test Pilot.
[[uninstall]]
retireDialogTitle = Uninstall Test Pilot?
retireMessage = As you wish. This will disable any active tests, uninstall the add-on and remove your account info from our servers.
retireEmailMessage = To opt out of email updates, simply click the <em>unsubscribe</em> link on any Test Pilot email.
retireSubmitButton = Proceed
retireCancelButton = Cancel
pageTitleRetirePage = Firefox Test Pilot - Uninstall Test Pilot
retirePageProgressMessage = Shutting down...
retirePageHeadline = Thanks for flying!
retirePageMessage = Hope you had fun experimenting with us. <br> Come back any time.
retirePageSurveyButton = Take a quick survey

# Shown to users after installing Test Pilot if a restart is required.
[[restartIntro]]
restartIntroLead = Preflight checklist
restartIntroOne = Restart your browser
restartIntroTwo = Locate the Test Pilot add-on
restartIntroThree = Select your experiments

# Shown on a page presented to users three days after installing their first experiment.
[[share]]
sharePrimary = Love Test Pilot? Help us find some new recruits.
shareSecondary = or just copy and paste this link...
shareEmail = E-mail
shareCopy = Copy

# Shown on pages of retired or retiring experiments.
eolIntroMessage = {$title} is ending on {$completedDate}
eolNoticeLink = Learn more
eolDisableMessage = The {$title} experiment has ended. Once you uninstall it you won't be able to re-install it through Test Pilot again.
completedDateLabel = Experiment End Date: <b>{$completedDate}</b>

# A warning shown to users looking at experiments incompatible with add-ons they already have installed.
[[incompatible]]
incompatibleHeader = This experiment may not be compatible with add-ons you have installed.
incompatibleSubheader = We recommend <a>disabling these add-ons</a> before activating this experiment:

# A form prompting the user to sign up for the Test Pilot Newsletter.
[[newsletterForm]]
newsletterFormEmailPlaceholder =
    [html/placeholder] Your email here
newsletterFormDisclaimer = We will only send you Test Pilot-related information.
newsletterFormPrivacyNotice = I'm okay with Mozilla handling my info as explained in <a>this privacy notice</a>.
newsletterFormSubmitButton = Sign Up Now
newsletterFormSubmitButtonSubmitting = Submitting...

# A section of the footer containing a newsletter signup form.
[[newsletterFooter]]
newsletterFooterError = There was an error submitting your email address. Try again?
newsletterFooterHeader = Stay Informed
newsletterFooterBody = Find out about new experiments and see test results for experiments you've tried.
newsletterFooterSuccessHeader = Thanks!
newsletterFooterSuccessBody = If you haven't previously confirmed a subscription to a Mozilla-related newsletter you may have to do so. Please check your inbox or your spam filter for an email from us.

# A warning shown to users viewing an experiment that is only available in English.
[[localeWarning]]
localeWarningTitle = This experiment is only available in English.
localeWarningSubtitle = You can still enable it if you like.

# An alternate splash page shown to users who have had Test Pilot installed for some time, but have no experiments installed.
[[experimentsListNoneInstalled]]
experimentsListNoneInstalledHeader = Let's get this baby off the ground!
experimentsListNoneInstalledSubheader = Ready to try a new Test Pilot experiment? Select one to enable, take it for a spin, and let us know what you think.
experimentsListNoneInstalledCTA = Not interested? <a>Let us know why</a>.

# Shown to users who do not have JavaScript enabled.
[[noscript]]
noScriptHeading = Uh oh...
noScriptMessage = Test Pilot requires JavaScript.<br>Sorry about that.
noScriptLink = Find out why

# Text of a button to toggle visibility of a list of past experiments.
[[pastExperiments]]
viewPastExperiments = View Past Experiments
hidePastExperiments = Hide Past Experiments
