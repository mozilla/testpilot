# testpilot-eol

Simpler Test Pilot site for overall program graduation.

Main features:

1. The simple JSON file at `/api/news_updates.json` should provide one last
   fresh item to trigger the add-on badge alert.

1. The site should automatically remove the Test Pilot add-on if it's
   detected on visit to the site.

## Development

```
npm install
npm start
open https://example.com:8000/
```

If you haven't already followed the Test Pilot quickstart instructions for
development, you'll need to use Firefox Developer Edition and enable the
`extensions.webapi.testing` preference in about:config. This is necessary to
run code for uninstalling the Test Pilot add-on.

## Accepting work from l10n branch

Because this EOL mini-site is a totally different set of commits from
master, accepting changes from the l10n branch is a little hacky.

Here's a quick-and-dirty way to do it:

```
git co l10n
git pull origin l10n
cp -r locales locales-new
git co eol
cp -r locales-new/* locales/
rm -rf locales-new
git add locales
git ci -m'Accept new l10n work'
```

Oh yeah, and check `availableLanguages` in `index.html` to ensure it lists all
the locales where strings are available.

## Building for Deployment

```
npm install
npm run static
```

This should leave you with a ready-to-deploy static site under the
`dist/` directory.
