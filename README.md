# testpilot-eol

Simpler Test Pilot site for overall program graduation.

Main features:

1. The simple JSON file at `/api/news_updates.json` should provide one last
   fresh item to trigger the add-on badge alert.

1. A button on the site should trigger code to un-install the Test Pilot
   add-on.

## Development

```
npm install
npm start
open https://example.com:8000/
```

There's currently no build process, just a static web server with SSL enabled
using the self-signed development certificates from Test Pilot proper.

If you haven't already followed the Test Pilot quickstart instructions for
development, you'll need to use Firefox Developer Edition and enable the
`extensions.webapi.testing` preference in about:config. This is necessary to
run code for uninstalling the Test Pilot add-on.
