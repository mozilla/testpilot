siteName = Firefox Test Pilot


# Page titles, put in the <title> HTML tag.
[[ pageTitle ]]

pageTitleDefault = Firefox Test Pilot
pageTitleLandingPage = Firefox Test Pilot
pageTitleExperimentListPage = Firefox Test Pilot - 実験
pageTitleExperiment = Firefox Test Pilot - { $title }



# Links in the footer.
[[ footerLink ]]

footerLinkCookies = Cookie
footerLinkPrivacy = プライバシー
footerLinkTerms = 規約
footerLinkLegal = 法的通知
footerLinkAbout = Test Pilot について



# Items in the menu.
[[ menu ]]

home = ホーム
menuTitle = 設定
menuWiki = Test Pilot Wiki
menuDiscuss = Test Pilot について議論する
menuFileIssue = 問題を報告
menuRetire = Test Pilot を削除



# The splash on the homepage.
[[ landing ]]

landingIntroLead = さらに先へ...
landingIntroOne = 新機能を試す。
landingIntroTwo = フィードバックを送る。
landingIntroThree = Firefox の開発に協力。
landingLegalNotice = 続けることで、あなたは Test Pilot の <a>利用規約</a> と <a>プライバシー通知</a> に同意したことになります。
landingExperimentsTitle = 最新の実験的機能を試す



# Related to the installation of the Test Pilot add-on.
[[ landingInstall ]]

landingInstallButton = Test Pilot アドオンをインストール
landingInstallingButton = インストール中...
landingInstalledButton = 機能を選ぶ



# Homepage messaging for users not on Firefox or with an old version of Firefox.
[[ landingFirefox ]]

landingRequiresDesktop = Test Pilot を試すには Windows、Mac または Linux 向けのデスクトップ版 Firefox が必要です
landingDownloadFirefoxDesc = Test Pilot は Windows、OS X および Linux 版の Firefox に対応しています)
landingUpgradeDesc = Test Pilot を試すには Firefox 45 以降が必要です。
landingDownloadFirefoxTitle = Firefox
landingUpgradeFirefoxTitle = Firefox をアップグレード
landingDownloadFirefoxSubTitle = 無料ダウンロード



# A section of the homepage explaining how Test Pilot works.
[[ landingCard ]]

landingCardListTitle = 3、2、1 と数えるうちに始めましょう
landingCardOne = Test Pilot アドオンを入手
landingCardTwo = 実験的機能を有効化
landingCardThree = あなたの考えをお聞かせください



# Shown after the user installs the Test Pilot add-on.
[[ onboarding ]]

onboardingMessage = Test Pilot をいつでも見つけられるよう、ツールバーにアイコンを追加しました。



# Error message pages.
[[ error ]]

errorHeading = おっと！
errorMessage = 何か問題が発生したようです。<br>また後で試してください。
notFoundHeader = ページが見つかりません



# A modal prompt to sign up for the Test Pilot newsletter.
[[ emailOptIn ]]

emailOptInDialogTitle = Test Pilot へようこそ！
emailOptInMessage = 新しい実験について知り、あなたが試した実験のテスト結果を見てみましょう。
emailValidationError = 有効なメールアドレスを入力してください！

# LOCALIZATION NOTE: The ':)' characters in the emailOptInInput placeholder are a smiley face emoticon.
emailOptInInput = 
  [html/placeholder] メールアドレスがここに入ります :)
emailOptInButton = ログイン
emailOptInSkip = スキップ
emailOptInConfirmationTitle = メールをお送りしました
emailOptInSuccessMessage2 = ありがとうございます！
emailOptInConfirmationClose = 実験に進む...



# A listing of all Test Pilot experiments.
[[ experimentsList ]]

experimentListPageHeader = 離陸準備完了！
experimentListPageSubHeader = 試してみたい機能を選んでください。<br>後日戻って新しい実験をチェックすることもお忘れなく。
experimentListEnabledTab = 有効
experimentListJustLaunchedTab = 最近公開
experimentListJustUpdatedTab = 最近更新
experimentListEndingTomorrow = 明日終了
experimentListEndingSoon = まもなく終了



# An individual experiment in the listing of all Test Pilot experiments.
[[ experimentCard ]]

experimentCardManage = 管理
experimentCardGetStarted = はじめに
experimentCardLearnMore = 詳細



# A modal prompt shown when a user disables an experiment.
[[ feedback ]]

feedbackSubmitButton = 簡単なアンケートに答える
feedbackCancelButton = 閉じる
feedbackUninstallTitle = ありがとうございます！
feedbackUninstallCopy = 
  | あなたの Firefox Test Pilot への参加は多くの
  | 意味を持ちます！ 他の実験についてもチェックし、
  | 今後追加される実験を楽しみにしてください！



# A modal prompt telling a user that they are about to go to an external forum for discussion.
[[ discussNotify ]]

discussNotifyTitle = 少々お待ちください...
discussNotifyMessageAccountless = 
  | <p>実験精神の一環として、私たちは外部のフォーラムサービスを使用しています。
  | フォーラムでの議論に参加したい場合は
  | アカウントを作成する必要があります。</p>
  | <p>アカウントを作成したくない場合は、いつでも
  | Test Pilot を通じてフィードバックを提供できます。
  | <br>
  | (送られた内容にはしっかり目を通しています)</p>
discussNotifySubmitButton = フォーラムへ移動
discussNotifyCancelButton = キャンセル



# A modal prompt shown before the feedback survey for some experiments.
[[ experimentPreFeedback ]]

experimentPreFeedbackTitle = { $title } のフィードバック
experimentPreFeedbackLinkCopy = { $title } の実験についてフィードバックを送る



# A splash shown on top of the experiment page when Test Pilot is not installed.
[[ experimentPromo ]]

experimentPromoHeader = 離陸準備は整いましたか？
experimentPromoSubheader = 私たちは Firefox の次世代機能を作っています。Test Pilot をインストールしてそれらを試してください！



# The experiment detail page. 
[[ experimentPage ]]

isEnabledStatusMessage = { $title } が有効化されました。
installErrorMessage = おっと、{ $title } を有効化できませんでした。また後で試してください。
participantCount = <span>{ $installation_count }</span> 人の参加者
otherExperiments = これらの実験的機能も試す
giveFeedback = フィードバックを送る
disableHeader = 実験を無効化しますか？
disableExperiment = { $title } を無効化
disableExperimentTransition = 無効化しています...
enableExperiment = { $title } を有効化
enableExperimentTransition = 有効化しています...
measurements = プライバシー
experimentPrivacyNotice = { $title } のデータ収集に関する詳細はこちらをご覧ください。
contributorsHeading = 提供:
version = バージョン
changelog = 変更ログ
tourLink = ツアー
lastUpdate = 最終更新日
contribute = 協力
bugReports = バグ報告
discourse = Discourse
tourOnboardingTitle = { $title } が有効化されました！
tourDoneButton = 完了
userCountContainer = 今現在 <span>{ $installation_count }</span> 人のユーザーが { $title } を試しています！
userCountContainerAlt = 最近公開！
highlightPrivacy = プライバシー



# Shown when an experiment requires a version of Firefox newer than the user's.
[[ upgradeNotice ]]

upgradeNoticeTitle = { $title } を試すには Firefox { $min_release } 以降が必要です。
upgradeNoticeLink = Firefox の更新方法



# Shown while uninstalling Test Pilot.
[[ uninstall ]]

retireDialogTitle = Test Pilot を削除しますか？
retireMessage = 了解しました。これにより、アクティブなテストはすべて無効化され、アドオンは削除され、サーバーからあなたのアカウント情報は削除されます。
retireEmailMessage = メールによる最新情報の配信を停止するには、Test Pilot に関するメール内の <em>購読中止</em> リンクをクリックしてください。
retireSubmitButton = 続ける
retireCancelButton = キャンセル
pageTitleRetirePage = Firefox Test Pilot - Test Pilot を削除
retirePageProgressMessage = 終了中...
retirePageHeadline = あなたのテスト飛行に感謝！
retirePageMessage = 実験をお楽しみいただけたでしょうか。<br>いつでも戻ってきてください。
retirePageSurveyButton = 簡単なアンケートに答える



# Shown to users after installing Test Pilot if a restart is required.
[[ restartIntro ]]

restartIntroLead = 離陸前チェックリスト
restartIntroOne = ブラウザを再起動
restartIntroTwo = Test Pilot アドオンを探す
restartIntroThree = 実験を選択



# Shown on a page presented to users three days after installing their first experiment.
[[ share ]]

sharePrimary = Test Pilot を気に入ってもらえましたか？ 新人を探す手助けをしてください。
shareSecondary = あるいは単純にこのリンクをコピー＆ペーストしてください...
shareEmail = メール
shareCopy = コピー

# Shown on pages of retired or retiring experiments.
eolIntroMessage = { $title } は { $completedDate } に終了します
eolNoticeLink = 詳細
eolDisableMessage = { $title } の実験は終了しました。一度削除すると Test Pilot を通じて再度インストールすることはできません。
completedDateLabel = 実験終了日: <b>{ $completedDate }</b>



# A warning shown to users looking at experiments incompatible with add-ons they already have installed.
[[ incompatible ]]

incompatibleHeader = この実験はあなたがインストールしているアドオンと互換性がないようです。
incompatibleSubheader = この実験に参加する前に <a>これらのアドオンを無効化</a> することをお勧めします:



# A form prompting the user to sign up for the Test Pilot Newsletter.
[[ newsletterForm ]]

newsletterFormEmailPlaceholder = 
  [html/placeholder] あなたのメールアドレスがここに入ります
newsletterFormDisclaimer = Test Pilot 関連の情報のみお送りします。
newsletterFormPrivacyNotice = Mozilla が <a>このプライバシー通知</a> に従って私の個人情報を扱うことに同意します。
newsletterFormSubmitButton = 今すぐ登録
newsletterFormSubmitButtonSubmitting = 送信中...



# A section of the footer containing a newsletter signup form.
[[ newsletterFooter ]]

newsletterFooterError = メールアドレスの送信中に問題が発生しました。再度試しますか？
newsletterFooterHeader = 今後も情報を受け取る
newsletterFooterBody = 新しい実験について知り、あなたが試した実験のテスト結果を見てみましょう。
newsletterFooterSuccessHeader = ありがとうございます！
newsletterFooterSuccessBody = これまでに Mozilla 関連のニュースレターを購読したことがない場合、購読開始の確認が必要となります。お送りした確認メールを受信トレイもしくは迷惑メールフィルタから探してください。



# A warning shown to users viewing an experiment that is only available in English.
[[ localeWarning ]]

localeWarningTitle = この実験は英語のみで利用可能です。
localeWarningSubtitle = お望みなら引き続き有効にしておくこともできます。



# An alternate splash page shown to users who have had Test Pilot installed for some time, but have no experiments installed.
[[ experimentsListNoneInstalled ]]

experimentsListNoneInstalledHeader = この機能を離陸させ軌道に乗せましょう！
experimentsListNoneInstalledSubheader = 新しい Test Pilot の実験を試す準備ができましたか？ どれか選んで有効にし、実際に試してみて、感想を聞かせてください。
experimentsListNoneInstalledCTA = 興味が湧きませんか？ <a>理由を聞かせてください</a>。



# Shown to users who do not have JavaScript enabled.
[[ noscript ]]

noScriptHeading = おっと...
noScriptMessage = 申し訳ありませんが、<br>Test Pilot を試すには JavaScript が必要です。
noScriptLink = 理由を確かめる



# Text of a button to toggle visibility of a list of past experiments.
[[ pastExperiments ]]

viewPastExperiments = 過去の実験を見る
hidePastExperiments = 過去の実験を隠す

