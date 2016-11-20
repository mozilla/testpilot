siteName = Firefox Test Pilot


# Page titles, put in the <title> HTML tag.
[[ pageTitle ]]

pageTitleDefault = Firefox Test Pilot
pageTitleLandingPage = Firefox Test Pilot
pageTitleExperimentListPage = Firefox Test Pilot - Experiment
pageTitleExperiment = Firefox Test Pilot - { $title }



# Links in the footer.
[[ footerLink ]]

footerLinkCookies = Kakor
footerLinkPrivacy = Sekretesspolicy
footerLinkTerms = Villkor
footerLinkLegal = Juridisk information
footerLinkAbout = Om Test Pilot



# Items in the menu.
[[ menu ]]

home = Hem
menuTitle = Inställningar
menuWiki = Wiki för Test Pilot
menuDiscuss = Diskutera Test Pilot
menuFileIssue = Rapportera ett problem
menuRetire = Avinstallera Test Pilot



# The splash on the homepage.
[[ landing ]]

landingIntroLead = Blicka framåt . . .
landingIntroOne = Testa nya funktioner.
landingIntroTwo = Ge dina synpunkter.
landingIntroThree = Hjälp till att utveckla Firefox.
landingLegalNotice = Genom att fortsätta godkänner du <a>användarvillkoren</a> och <a>sekretesspolicy</a> för Test Pilot.
landingExperimentsTitle = Testa de senaste experimentella funktionerna



# Related to the installation of the Test Pilot add-on.
[[ landingInstall ]]

landingInstallButton = Installera tillägget Test Pilot
landingInstallingButton = Installerar...
landingInstalledButton = Välj dina funktioner



# Homepage messaging for users not on Firefox or with an old version of Firefox.
[[ landingFirefox ]]

landingRequiresDesktop = Test Pilot kräver Firefox för datorer i Windows, Mac eller Linux
landingDownloadFirefoxDesc = (Test Pilot är tillgänglig för Firefox på Windows, OS X och Linux)
landingUpgradeDesc = Test Pilot kräver Firefox 45 eller högre.
landingDownloadFirefoxTitle = Firefox
landingUpgradeFirefoxTitle = Uppgradera Firefox
landingDownloadFirefoxSubTitle = Gratis nedladdning



# A section of the homepage explaining how Test Pilot works.
[[ landingCard ]]

landingCardListTitle = Kom igång med tre enkla steg
landingCardOne = Hämta tillägget Test Pilot
landingCardTwo = Aktivera experimentella funktioner
landingCardThree = Berätta vad du tycker



# Shown after the user installs the Test Pilot add-on.
[[ onboarding ]]

onboardingMessage = Vi lägger till en ikon i verktygsfältet så att du alltid kan hitta Test Pilot.



# Error message pages.
[[ error ]]

errorHeading = Hoppsan!
errorMessage = Ser ut som något är trasigt. <br> Försök igen senare.
notFoundHeader = Fyra noll fyra!



# A modal prompt to sign up for the Test Pilot newsletter.
[[ emailOptIn ]]

emailOptInDialogTitle = Välkommen till Test Pilot!
emailOptInMessage = Få reda på mer om nya experiment och se testresultat för experiment som du har testat.
emailValidationError = Var vänlig ange en giltig e-postadress!

# LOCALIZATION NOTE: The ':)' characters in the emailOptInInput placeholder are a smiley face emoticon.
emailOptInInput = 
  [html/placeholder] ange din e-postadress :)
emailOptInButton = Registrera mig
emailOptInSkip = Hoppa över
emailOptInConfirmationTitle = E-post har skickats
emailOptInSuccessMessage2 = Tack!
emailOptInConfirmationClose = Vidare till experimenten...



# A listing of all Test Pilot experiments.
[[ experimentsList ]]

experimentListPageHeader = Redo för start!
experimentListPageSubHeader = Välj de funktioner du vill prova. <br> Kom tillbaka snart för fler experiment.
experimentListEnabledTab = Aktivera
experimentListJustLaunchedTab = Nyligen startad
experimentListJustUpdatedTab = Nyligen uppdaterad
experimentListEndingTomorrow = Slutar imorgon
experimentListEndingSoon = Slutar snart



# An individual experiment in the listing of all Test Pilot experiments.
[[ experimentCard ]]

experimentCardManage = Hantera
experimentCardGetStarted = Kom igång
experimentCardLearnMore = Läs mer



# A modal prompt shown when a user disables an experiment.
[[ feedback ]]

feedbackSubmitButton = Gör en snabb undersökning
feedbackCancelButton = Stäng
feedbackUninstallTitle = Tack!
feedbackUninstallCopy = 
  | Ditt deltagande i Firefox Test Pilot innebär
  | mycket! Kolla in våra andra experiment,
  | och håll ögonen öppna för mer framöver!



# A modal prompt telling a user that they are about to go to an external forum for discussion.
[[ discussNotify ]]

discussNotifyTitle = Bara en sekund...
discussNotifyMessageAccountless = 
  | <p>I andan av experiment använder vi en extern forumtjänst.
  | Du måste skapa ett konto om du
  | önskar delta på forumet.</p>
  | <p>Om du inte vill skapa ett konto, kan du
  | alltid lämna återkoppling genom Test Pilot.
  | <br>
  | (Vi läser verkligen detta)</p>
discussNotifySubmitButton = Ta mig till forumet
discussNotifyCancelButton = Avbryt



# A modal prompt shown before the feedback survey for some experiments.
[[ experimentPreFeedback ]]

experimentPreFeedbackTitle = Återkoppling { $title }
experimentPreFeedbackLinkCopy = Ge återkoppling för experimentet { $title }



# A splash shown on top of the experiment page when Test Pilot is not installed.
[[ experimentPromo ]]

experimentPromoHeader = Redo för start?
experimentPromoSubheader = Vi bygger nästa generations funktioner för Firefox. Installera Test Pilot för att prova dem!



# The experiment detail page. 
[[ experimentPage ]]

isEnabledStatusMessage = { $title } är aktiverad.
installErrorMessage = Hoppsan. { $title } kunde inte aktiveras. Försök igen senare.
participantCount = <span>{ $installation_count }</span> deltagare
otherExperiments = Prova dessa experiment också
giveFeedback = Ge återkoppling
disableHeader = Inaktivera experiment?
disableExperiment = Inaktivera { $title }
disableExperimentTransition = Inaktiverar...
enableExperiment = Aktivera { $title }
enableExperimentTransition = Aktiverar...
measurements = Din sekretesspolicy
experimentPrivacyNotice = Du kan läsa mer om datainsamlingen för { $title } här.
contributorsHeading = Presenteras av
version = Version
changelog = ändringslogg
tourLink = guidad visning
lastUpdate = Senast uppdaterad
contribute = Bidra
bugReports = Felrapporter
discourse = Diskutera
tourOnboardingTitle = { $title } är aktiverad!
tourDoneButton = Klar
userCountContainer = Det finns <span>{ $installation_count }</span> personer som provar { $title } just nu!
userCountContainerAlt = Nyligen startad!
highlightPrivacy = Din sekretesspolicy



# Shown when an experiment requires a version of Firefox newer than the user's.
[[ upgradeNotice ]]

upgradeNoticeTitle = { $title } kräver Firefox { $min_release } eller senare.
upgradeNoticeLink = Hur du uppdaterar Firefox.



# Shown while uninstalling Test Pilot.
[[ uninstall ]]

retireDialogTitle = Avinstallera Test Pilot?
retireMessage = Som du önskar. Detta kommer att inaktivera alla aktiva tester, avinstallera tillägget och ta bort din kontoinformation från våra servrar.
retireEmailMessage = För att välja bort e-postuppdateringar, klicka på länken <em>avbryt prenumeration</em> på någon Test Pilot e-post.
retireSubmitButton = Fortsätt
retireCancelButton = Avbryt
pageTitleRetirePage = Firefox Test Pilot - Avinstallera Test Pilot
retirePageProgressMessage = Avslutar...
retirePageHeadline = Tack för att du testar!
retirePageMessage = Hoppas du hade kul att experimentera med oss. <br> Komma gärna tillbaks någon gång.
retirePageSurveyButton = Gör en snabb undersökning



# Shown to users after installing Test Pilot if a restart is required.
[[ restartIntro ]]

restartIntroLead = Checklista före start
restartIntroOne = Starta om webbläsaren
restartIntroTwo = Hitta tillägget Test Pilot
restartIntroThree = Välj dina experiment



# Shown on a page presented to users three days after installing their first experiment.
[[ share ]]

sharePrimary = Gillar du Test Pilot? Hjälp oss att hitta några nya medlemmar.
shareSecondary = eller kopiera och klistra in den här länken...
shareEmail = E-post
shareCopy = Kopiera

# Shown on pages of retired or retiring experiments.
eolIntroMessage = { $title } slutar den { $completedDate }
eolNoticeLink = Läs mer
eolDisableMessage = Experimentet { $title } har avslutats. När du avinstallerar det kommer du inte att kunna återinstallera det genom Test Pilot igen.
completedDateLabel = Slutdatum för experiment: <b>{ $completedDate }</b>



# A warning shown to users looking at experiments incompatible with add-ons they already have installed.
[[ incompatible ]]

incompatibleHeader = Detta experiment kanske inte är kompatibelt med tillägg som du har installerat.
incompatibleSubheader = Vi rekommenderar att du <a>inaktiverar dessa tillägg</a> innan du aktiverar det här experimentet:



# A form prompting the user to sign up for the Test Pilot Newsletter.
[[ newsletterForm ]]

newsletterFormEmailPlaceholder = 
  [html/placeholder] Din e-post
newsletterFormDisclaimer = Vi skickar endast Test Pilot relaterad information.
newsletterFormPrivacyNotice = Jag är okej med Mozilla hantering min information som beskrivs i <a>denna sekretesspolicy</a>.
newsletterFormSubmitButton = Registrera dig nu
newsletterFormSubmitButtonSubmitting = Skickar...



# A section of the footer containing a newsletter signup form.
[[ newsletterFooter ]]

newsletterFooterError = Det uppstod ett fel när din e-postadress skickades in. Försök igen?
newsletterFooterHeader = Håll dig informerad
newsletterFooterBody = Få reda på mer om nya experiment och se testresultat för experiment som du har testat.
newsletterFooterSuccessHeader = Tack!
newsletterFooterSuccessBody = Om du tidigare inte har bekräftat en prenumeration på en Mozilla-relaterat nyhetsbrev kan du behöva göra det. Kontrollera din inkorg eller ditt spamfilter för ett e-postmeddelande från oss.



# A warning shown to users viewing an experiment that is only available in English.
[[ localeWarning ]]

localeWarningTitle = Detta experiment är endast tillgängligt på engelska.
localeWarningSubtitle = Du kan fortfarande aktivera det om du vill.



# An alternate splash page shown to users who have had Test Pilot installed for some time, but have no experiments installed.
[[ experimentsListNoneInstalled ]]

experimentsListNoneInstalledHeader = Låt oss komma igång!
experimentsListNoneInstalledSubheader = Redo att prova en nytt experiment från Test Pilot? Välj en för att aktivera, ta det på en provtur och låt oss veta vad du tycker.
experimentsListNoneInstalledCTA = Inte intresserad? <a>Låt oss veta varför</a>.



# Shown to users who do not have JavaScript enabled.
[[ noscript ]]

noScriptHeading = Ojdå...
noScriptMessage = Test Pilot kräver JavaScript.<br>Ledsen för det.
noScriptLink = Ta reda på varför



# Text of a button to toggle visibility of a list of past experiments.
[[ pastExperiments ]]

viewPastExperiments = Visa tidigare experiment
hidePastExperiments = Dölj tidigare experiment

