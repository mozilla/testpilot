siteName = Firefox Test Pilot


// Page titles, put in the <title> HTML tag.
[[ pageTitle ]]

pageTitleDefault = Firefox Test Pilot
pageTitleLandingPage = Firefox Test Pilot
pageTitleExperimentListPage = Firefox Test Pilot - Experimentos
pageTitleExperiment = Firefox Test Pilot - { $title }


// Links in the footer.
[[ footerLink ]]

footerLinkCookies = Cookies
footerLinkPrivacy = Privacidad
footerLinkTerms = Términos
footerLinkLegal = Legal
footerLinkAbout = Acerca de Test Pilot


// Items in the menu.
[[ menu ]]

home = Inicio
menuTitle = Ajustes
menuWiki = Wiki de Test Pilot
menuDiscuss = Discuss de Test Pilot
menuFileIssue = Ingresar un reporte
menuRetire = Desinstalar Test Pilot


// The splash on the homepage.
[[ landing ]]

landingIntroOne = Prueba nuevas funciones.
landingIntroTwo = Da tu opinión.
landingIntroThree = Ayuda a construir Firefox.
landingLegalNotice = Al proceder, aceptas los <a>Términos de uso</a> y el <a>Aviso de privacidad</a> de Test Pilot.
landingExperimentsTitle = Prueba las últimas funciones experimentales


// Related to the installation of the Test Pilot add-on.
[[ landingInstall ]]

landingInstallButton = Instalar el complemento de Test Pilot
landingInstallingButton = Instalando...
landingInstalledButton = Elige tus funciones


// Related to a one click to install test pilot and an experiment.
[[ oneClickInstall ]]

oneClickInstallMinorCta = Instalar Test Pilot y
oneClickInstallMajorCta = Activar { $title }


// Homepage messaging for users not on Firefox or with an old version of Firefox.
[[ landingFirefox ]]

landingRequiresDesktop = Test Pilot requiere Firefox para Escritorio en Windows, Mac o Linux
landingDownloadFirefoxDesc = (Test Pilot esta disponible para Firefox en Windows, OS X y Linux)
landingUpgradeDesc = Test Pilot requiere Firefox 49 o superior.
landingDownloadFirefoxTitle = Firefox
landingUpgradeFirefoxTitle = Actualiza Firefox
landingDownloadFirefoxSubTitle = Bájalo gratis


// A section of the homepage explaining how Test Pilot works.
[[ landingCard ]]

landingCardListTitle = Empieza en 3, 2, 1
landingCardOne = Obtén el complemento de Test Pilot
landingCardTwo = Activa las funciones experimentales
landingCardThree = Cuéntanos lo que piensas


// Shown after the user installs the Test Pilot add-on.
[[ onboarding ]]

onboardingMessage = Pusimos un ícono en tu barra de herramientas para que siempre puedas encontrar Test Pilot.


// Error message pages.
[[ error ]]

errorHeading = ¡Chuta!
errorMessage = Parece que nos echamos algo. <br> Vuelve a intentarlo más tarde.
notFoundHeader = ¡Cuatro Cero Cuatro!


// A modal prompt to sign up for the Test Pilot newsletter.
[[ emailOptIn ]]

emailOptInDialogTitle = ¡Bienvenido a Test Pilot!
emailOptInMessage = Entérate de nuevos experimentos y mira los resultados de aquellos en los que has participado.
emailOptInConfirmationTitle = Correo enviado
emailOptInSuccessMessage2 = ¡Gracias!
emailOptInConfirmationClose = A los experimentos...


// A listing of all Test Pilot experiments.
[[ experimentsList ]]

experimentListEnabledTab = Activado
experimentListJustLaunchedTab = Recién lanzado
experimentListJustUpdatedTab = Recién actualizado
experimentListEndingTomorrow = Termina mañana
experimentListEndingSoon = Termina pronto
experimentsListCondensedHeader = ¡Selecciona tus experimentos!


// An individual experiment in the listing of all Test Pilot experiments.
[[ experimentCard ]]

experimentCardManage = Gestionar
experimentCardGetStarted = Empezar
experimentCardLearnMore = Aprender más


// A modal prompt shown when a user disables an experiment.
[[ feedback ]]

feedbackSubmitButton = Responder una encuesta
feedbackUninstallTitle = ¡Gracias!
feedbackUninstallCopy =
    ¡Tu participación en Firefox Test Pilot significa
    mucho! Por favor, revisa estos otros experimentos,
    y mantente pendiente de los que vendrán!


// A modal prompt shown before the feedback survey for some experiments.
[[ experimentPreFeedback ]]

experimentPreFeedbackTitle = Comentarios de { $title }
experimentPreFeedbackLinkCopy = Danos comentarios sobre el experimento { $title }


// A splash shown on top of the experiment page when Test Pilot is not installed.
[[ experimentPromo ]]

experimentPromoHeader = ¿Listo para despegar?
experimentPromoSubheader = Estamos preparando la siguiente generación de funciones para Firefox. ¡Instala Test Pilot para probarlas!


// The experiment detail page.
[[ experimentPage ]]

isEnabledStatusMessage = { $title } está activado.
installErrorMessage = Chuta. { $title } no pudo ser activado. Vuelve a intentarlo más tarde.
participantCount = <span>{ $installation_count }</span> participantes
otherExperiments = Prueba también estos experimentos
giveFeedback = Da tu opinión
disableHeader = ¿Desactivar experimento?
disableExperiment = Desactivar { $title }
disableExperimentTransition = Desactivando...
enableExperiment = Activar { $title }
enableExperimentTransition = Activando...
experimentManuallyDisabled = { $title } desactivado en el Administrador de complementos
experimentMeasurementIntro = En adición a los <a>datos</a> recolectados por todos los experimentos de Test Pilot, aquí están las cosas clave que debieras saber sobre lo que sucede cuando usas { $experimentTitle }:
measurements = Tu privacidad
experimentPrivacyNotice = Puedes leer más sobre la recolección de datos para { $title } aquí.
contributorsHeading = Traído a ti por
contributorsExtraLearnMore = Aprender más
changelog = Lista de cambios
tour = Tur
tourLink = Tur de lanzamiento
contribute = Contribuir
bugReports = Reportes de errores
discussExperiment = Opinar sobre { $title }
tourOnboardingTitle = ¡{ $title } activado!
tourDoneButton = Hecho
userCountContainer = ¡Hay <span>{ $installation_count }</span> personas probando { $title } en este momento!
userCountContainerAlt = ¡Recién lanzado!
highlightPrivacy = Tu privacidad


// Shown when an experiment requires a version of Firefox newer than the user's.
[[ upgradeNotice ]]

upgradeNoticeTitle = { $title } requiere Firefox { $min_release } o posterior.
upgradeNoticeLink = Cómo actualizar Firefox.
versionChangeNotice = { $experiment_title } no está soportado en esta versión de Firefox.
versionChangeNoticeLink = Obtén la versión actual de Firefox.


// Shown while uninstalling Test Pilot.
[[ uninstall ]]

retireDialogTitle = ¿Desinstalar Test Pilot?
retireMessage = Tal como lo deseas. Esto desactivara toda prueba activa, desinstalará el complemento y eliminará la información de tu cuenta de nuestros servidores.
retireEmailMessage = Para salir del boletín por correo, simplemente aprieta el enlace <em>desuscribir</em> en cualquier correo de Test Pilot.
retireSubmitButton = Proceder
pageTitleRetirePage = Firefox Test Pilot - Desinstalar Test Pilot
retirePageProgressMessage = Apagando...
retirePageHeadline = ¡Gracias por volar!
retirePageMessage = Esperamos que te hayas divertido con nosotros. <br> ¡Regresa cuando quieras!
retirePageSurveyButton = Responder una encuesta


// Shown to users after installing Test Pilot if a restart is required.
[[ restartIntro ]]

restartIntroLead = Revisión previa al vuelo
restartIntroOne = Reinicia tu navegador
restartIntroTwo = Ubica el complemento de Test Pilot
restartIntroThree = Selecciona tus experimentos


// Shown on a page presented to users three days after installing their first experiment.
[[ share ]]

sharePrimary = ¿Te encantó Test Pilot? Ayúdanos a encontrar nuevos reclutas.
shareSecondary = o simplemente copia y pega este enlace...
shareEmail = Correo
shareCopy = Copiar
// Shown on pages of retired or retiring experiments.
eolIntroMessage = { $title } se acaba el { $completedDate }
eolNoticeLink = Aprender más
eolDisableMessage = El experimento { $title } ha terminado. Una vez que lo desinstales no podrás reinstalarlo a través de Test Pilot.
completedDateLabel = Fecha de término: <b>{ $completedDate }</b>


// A warning shown to users looking at experiments incompatible with add-ons they already have installed.
[[ incompatible ]]

incompatibleHeader = Puede que este experimento no sea compatible con complementos que hayas instalado.
incompatibleSubheader = Recomendamos <a>desactivar estos complementos</a> antes de activar este experimento:


// A form prompting the user to sign up for the Test Pilot Newsletter.
[[ newsletterForm ]]

newsletterFormEmailPlaceholder
    .placeholder = tu correo va aquí
newsletterFormDisclaimer = Solo te enviaremos información relacionada con Test Pilot.
newsletterFormPrivacyNotice = Me parece bien que Mozilla gestione mi información según se indica en el <a>Aviso de privacidad</a>.
newsletterFormPrivacyAgreementRequired = Por favor, marca esta cajita si quieres proceder.
newsletterFormSubmitButton = Suscríbete ahora
newsletterFormSubmitButtonSubmitting = Enviando...


// A section of the footer containing a newsletter signup form.
[[ newsletterFooter ]]

newsletterFooterError = Hubo un error al enviar tu correo. ¿Volvemos a intentarlo?
newsletterFooterHeader = Mantente informado
newsletterFooterBody = Entérate de nuevos experimentos y mira los resultados de aquellos en los que has participado.
newsletterFooterSuccessHeader = ¡Gracias!
newsletterFooterSuccessBody = Si no has confirmado previamente una suscripción a un boletín relacionado a Mozilla, puede que tengas que hacerlo. Por favor, revisa tu bandeja de entrada o filtro de spam en busca de un email de nosotros.


// A warning shown to users when the experiment is not available in their language
[[ localeWarning ]]

localeUnavailableWarningTitle = Este experimento no está soportado en tu idioma ({ $locale_code }).
localeWarningSubtitle = Todavía lo puedes activar si lo deseas.


// An alternate splash page shown to users who have had Test Pilot installed for some time, but have no experiments installed.
[[ experimentsListNoneInstalled ]]

experimentsListNoneInstalledHeader = ¡Hagamos despegar este bebé!
experimentsListNoneInstalledSubheader = ¿Listo para probar un nuevo experimento de Test Pilot? Selecciona uno para activarlo, pruébalo y cuéntanos que piensas.
experimentsListNoneInstalledCTA = ¿No te interesa? <a>Dinos por qué</a>.


// Shown to users who do not have JavaScript enabled.
[[ noscript ]]

noScriptHeading = Chuta...
noScriptMessage = Test Pilot requiere JavaScript.<br>Lo sentimos.
noScriptLink = Descubre por qué


// Text of a button to toggle visibility of a list of past experiments.
[[ pastExperiments ]]

viewPastExperiments = Ver experimentos anteriores
hidePastExperiments = Ocultar experimentos anteriores
