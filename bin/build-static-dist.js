const path = require("path");
const fs = require("fs-extra");

async function main () {
  await fs.ensureDir("./dist");
  await fs.emptyDir("./dist");

  const toCopy = [
    ["./src", "./dist"],
    ["./locales", "./dist/locales"],
    [
      "./node_modules/fluent-web/fluent-web.js",
      "./dist/lib/fluent-web-bundle.js"
    ]
  ];
  for (let args of toCopy) {
    await fs.copy(...args);
  }

  for (let pagePath of REDIRECTS) {
    const fullPagePath = path.join("./dist", pagePath);
    await fs.ensureDir(path.dirname(fullPagePath));
    await fs.writeFile(fullPagePath, REDIRECT_HTML);
  }
}

const REDIRECT_HTML = `
<!doctype html>
<html>
  <head>
    <meta http-equiv="refresh" content="0;url=/" />
  </head>
</html>
`.trim();

// This came from an original Test Pilot build:
//   npm run static
//   find ./dist -type f -name '*.html'
const REDIRECTS = `
./about/en-US/index.html
./about/index.html
./error/index.html
./experiments/activity-stream/index.html
./experiments/advance/index.html
./experiments/cliqz/index.html
./experiments/color/index.html
./experiments/containers/index.html
./experiments/dev-example/index.html
./experiments/email-tabs/index.html
./experiments/firefox-lockbox/index.html
./experiments/index.html
./experiments/min-vid/index.html
./experiments/no-more-404s/index.html
./experiments/notes/index.html
./experiments/page-shot/index.html
./experiments/price-wise/index.html
./experiments/pulse/index.html
./experiments/send/index.html
./experiments/side-view/index.html
./experiments/snooze-tabs/index.html
./experiments/tab-center/index.html
./experiments/tracking-protection/index.html
./experiments/universal-search/index.html
./experiments/voice-fill/index.html
./notfound/index.html
./onboarding/index.html
./privacy/de/index.html
./privacy/en-US/index.html
./privacy/index.html
./retire/index.html
./terms/de/index.html
./terms/en-US/index.html
./terms/index.html
`.trim().split("\n");

main()
  .then(() => console.log("Build complete."))
  .catch(e => {
    console.log("Build failed!", e)
    process.exit(1);
  });
