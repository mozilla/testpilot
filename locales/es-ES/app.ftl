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
menuWiki = Wiki del Test Pilot
menuDiscuss = Hablemos de Test Pilot
menuFileIssue = Abre una incidencia
menuRetire = Desinstalar Test Pilot


// The splash on the homepage.
[[ landing ]]

landingIntroOne = Prueba novedades.
landingIntroTwo = Da tu opinión.
landingIntroThree = Ayuda a construir Firefox.
landingLegalNotice = Al continuar, aceptas los <a>Términos de uso</a> y el <a>Aviso sobre privacidad</a> de Test Pilot.
landingExperimentsTitle = Prueba las últimas características experimentales


// Related to the installation of the Test Pilot add-on.
[[ landingInstall ]]

landingInstallButton = Instalar el complemento Test Pilot
landingInstallingButton = Instalando...
landingInstalledButton = Elige tus funciones


// Related to a one click to install test pilot and an experiment.
[[ oneClickInstall ]]

oneClickInstallMinorCta = Inslatar Test Pilot &amp;
oneClickInstallMajorCta = Activar { $title }


// Homepage messaging for users not on Firefox or with an old version of Firefox.
[[ landingFirefox ]]

landingRequiresDesktop = Test Pilot requiere Firefox para escritorio en Windows, Mac o Linux
landingDownloadFirefoxDesc = (Test Pilot está disponible para Firefox en Windows, OS X y Linux)
landingUpgradeDesc = Test Pilot requiere Firefox 49 o superior.
landingDownloadFirefoxTitle = Firefox
landingUpgradeFirefoxTitle = Actualizar Firefox
landingDownloadFirefoxSubTitle = Descarga gratuita


// A section of the homepage explaining how Test Pilot works.
[[ landingCard ]]

landingCardListTitle = Empieza en 3, 2, 1
landingCardOne = Instala el complemento Test Pilot
landingCardTwo = Activa características experimentales
landingCardThree = Cuéntanos tu opinión


// Shown after the user installs the Test Pilot add-on.
[[ onboarding ]]

onboardingMessage = Hemos puesto un icono en la barra de herramientas para que accedas fácilmente a Test Pilot.


// Error message pages.
[[ error ]]

errorHeading = ¡Ups!
errorMessage = Parece que algo va mal. <br> Vuelve a intentarlo luego.
notFoundHeader = ¡Cuatro cero cuatro!


// A modal prompt to sign up for the Test Pilot newsletter.
[[ emailOptIn ]]

emailOptInDialogTitle = ¡Te damos la bienvenida a Test Pilot!
emailOptInMessage = Descubre nuevos experimentos y mira los resultados de los experimentos en los que has participado.
emailValidationError = ¡Usa una dirección de correo válida!
// The ':)' characters in the emailOptInInput placeholder are a smiley face emoticon.
emailOptInInput
    .placeholder = el correo va aquí :)
emailOptInButton = Suscribirme
emailOptInConfirmationTitle = Email enviado
emailOptInSuccessMessage2 = ¡Gracias!
emailOptInConfirmationClose = Vamos a los experimentos...


// A listing of all Test Pilot experiments.
[[ experimentsList ]]

experimentListEnabledTab = Activados
experimentListJustLaunchedTab = Recién iniciados
experimentListJustUpdatedTab = Recién actualizados
experimentListEndingTomorrow = Finaliza mañana
experimentListEndingSoon = Finaliza pronto
experimentsListCondensedHeader = ¡Escoge tus experimentos!


// An individual experiment in the listing of all Test Pilot experiments.
[[ experimentCard ]]

experimentCardManage = Administrar
experimentCardGetStarted = Comenzar
experimentCardLearnMore = Descubre más


// A modal prompt shown when a user disables an experiment.
[[ feedback ]]

feedbackSubmitButton = Participa en una encuesta rápida
feedbackUninstallTitle = ¡Gracias!
feedbackUninstallCopy = Tu participación en Firefox Test Pilot significa mucho para nosotros. ¡Échale un vistazo a otros experimentos y no te pierdas las próximas novedades!


// A modal prompt shown before the feedback survey for some experiments.
[[ experimentPreFeedback ]]

experimentPreFeedbackTitle = Opinión de { $title }
experimentPreFeedbackLinkCopy = Cuéntanos tu opinión sobre el experimento { $title }


// A splash shown on top of the experiment page when Test Pilot is not installed.
[[ experimentPromo ]]

experimentPromoHeader = ¿Listo para despegar?
experimentPromoSubheader = Estamos creando la próxima generación de funciones de Firefox. ¡Instala Test Pilot para probarlas!


// The experiment detail page.
[[ experimentPage ]]

isEnabledStatusMessage = { $title } está activado.
installErrorMessage = Oh, oh. No se pudo activar { $title }. Vuelve a intentarlo luego.
participantCount = <span>{ $installation_count }</span> participantes
otherExperiments = Prueba también estos experimentos
giveFeedback = Enviar comentarios
disableHeader = ¿Desactivar experimento?
disableExperiment = Desactivar { $title }
disableExperimentTransition = Desactivando...
enableExperiment = Activar { $title }
enableExperimentTransition = Activando...
experimentManuallyDisabled = { $title } desactivado en el administrador de complementos
experimentMeasurementIntro = Además de los <a>datos</a> que almacenan todos los experimentos de Test Pilot, la siguiente información es clave para saber qué ocurre cuando utilizas { $experimentTitle }:
measurements = Tu privacidad
experimentPrivacyNotice = Descubre más sobre la recopilación de datos de { $title } aquí.
contributorsHeading = Diseñado por
contributorsExtraLearnMore = Descubre más
changelog = registro de cambios
tour = Visita guiada
tourLink = visita virtual
contribute = Colabora
bugReports = Informes de fallos
discussExperiment = Hablar sobre { $title }
tourOnboardingTitle = ¡{ $title } activado!
tourDoneButton = Hecho
userCountContainer = ¡Hay <span>{ $installation_count }</span> personas probando { $title } ahora mismo!
userCountContainerAlt = ¡Recién iniciado!
highlightPrivacy = Tu privacidad


// Shown when an experiment requires a version of Firefox newer than the user's.
[[ upgradeNotice ]]

upgradeNoticeTitle = { $title } requiere Firefox { $min_release } o posterior.
upgradeNoticeLink = Cómo actualizar Firefox.


// Shown while uninstalling Test Pilot.
[[ uninstall ]]

retireDialogTitle = ¿Desinstalamos Test Pilot?
retireMessage = Como quieras. Se desactivarán los tests activos, se desinstalará el complemento y se eliminará la información de tu cuenta de nuestros servidores.
retireEmailMessage = Para no recibir actualizaciones por correo, haz clic en el enlace <em>cancelar suscripción</em> de cualquier correo de Test Pilot.
retireSubmitButton = Continuar
pageTitleRetirePage = Firefox Test Pilot - Desinstalar Test Pilot
retirePageProgressMessage = Apagando...
retirePageHeadline = ¡Gracias por volar con nosotros!
retirePageMessage = Esperamos que te haya gustado experimentar con nosotros. <br> Vuelve cuando quieras.
retirePageSurveyButton = Participa en una encuesta rápida


// Shown to users after installing Test Pilot if a restart is required.
[[ restartIntro ]]

restartIntroLead = Comprobación preliminar
restartIntroOne = Reinicia el navegador
restartIntroTwo = Ubica el complemento Test Pilot
restartIntroThree = Selecciona tus experimentos


// Shown on a page presented to users three days after installing their first experiment.
[[ share ]]

sharePrimary = ¿Te encanta Test Pilot? Ayúdanos a atraer a la gente.
shareSecondary = o copia y pega este enlace...
shareEmail = Correo
shareCopy = Copiar
// Shown on pages of retired or retiring experiments.
eolIntroMessage = { $title } termina el { $completedDate }
eolNoticeLink = Descubre más
eolDisableMessage = El experimento { $title } ha finalizado. Cuando lo desinstales, no podrás volver a instalarlo a través de Test Pilot.
completedDateLabel = Fecha de finalización: <b>{ $completedDate }</b>


// A warning shown to users looking at experiments incompatible with add-ons they already have installed.
[[ incompatible ]]

incompatibleHeader = Puede que este experimento no sea compatible con otros complementos que tienes instalados.
incompatibleSubheader = Te recomendamos <a>desactivar estos complementos</a> antes de activar el experimento:


// A form prompting the user to sign up for the Test Pilot Newsletter.
[[ newsletterForm ]]

newsletterFormEmailPlaceholder
    .placeholder = Tu correo aquí
newsletterFormDisclaimer = Solo te enviaremos información relacionada con Test Pilot.
newsletterFormPrivacyNotice = Me parece bien que Mozilla gestione mi información según se indica en <a>este aviso sobre privacidad</a>.
newsletterFormPrivacyAgreementRequired = Marca esta casilla si quieres continuar.
newsletterFormSubmitButton = Suscríbete ya
newsletterFormSubmitButtonSubmitting = Enviando...


// A section of the footer containing a newsletter signup form.
[[ newsletterFooter ]]

newsletterFooterError = Se produjo un error al enviar tu correo electrónico. ¿Reintentamos?
newsletterFooterHeader = Mantente informado
newsletterFooterBody = Descubre nuevos experimentos y mira los resultados de los experimentos en los que has participado.
newsletterFooterSuccessHeader = ¡Gracias!
newsletterFooterSuccessBody = Tienes que confirmar la suscripción a un boletín de noticias de Mozilla si no lo has hecho antes. Busca un correo nuestro en tu bandeja de entrada o en la carpeta de spam.


// A warning shown to users when the experiment is not available in their language
[[ localeWarning ]]

localeUnavailableWarningTitle = Este experimento no está disponible en tu idioma ({ $locale_code }).
localeWarningSubtitle = Si quieres, todavía puedes activarlo.


// An alternate splash page shown to users who have had Test Pilot installed for some time, but have no experiments installed.
[[ experimentsListNoneInstalled ]]

experimentsListNoneInstalledHeader = ¡Es hora de hacer despegar esta nave!
experimentsListNoneInstalledSubheader = ¿Preparado para probar un nuevo experimento Test Pilot? Selecciona uno para activarlo, pruébalo y danos tu opinión.
experimentsListNoneInstalledCTA = ¿No te interesa? <a>Dinos por qué</a>.


// Shown to users who do not have JavaScript enabled.
[[ noscript ]]

noScriptHeading = Oh, oh...
noScriptMessage = Test Pilot necesita JavaScript.<br>Lo sentimos.
noScriptLink = Descubre por qué


// Text of a button to toggle visibility of a list of past experiments.
[[ pastExperiments ]]

viewPastExperiments = Ver experimentos antiguos
hidePastExperiments = Ocultar experimentos antiguos
