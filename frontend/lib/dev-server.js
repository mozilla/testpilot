const fs = require("fs");
const url = require("url");
const path = require("path");
const https = require("https");
const express = require("express");
const morgan = require("morgan");

// TODO: CSP copied from bin/deploy.sh - find a way to extract automatically?
const CSP = `default-src 'self'; connect-src 'self' https://sentry.prod.mozaws.net https://www.google-analytics.com https://ssl.google-analytics.com https://basket.mozilla.org https://location.services.mozilla.com; font-src 'self' https://code.cdn.mozilla.net; form-action 'none'; frame-ancestors 'self' https://pontoon.mozilla.org; img-src 'self' https://pontoon.mozilla.org https://ssl.google-analytics.com https://www.google-analytics.com; object-src 'none'; script-src 'self' https://pontoon.mozilla.org https://ssl.google-analytics.com; style-src 'self' https://pontoon.mozilla.org https://code.cdn.mozilla.net; report-uri /__cspreport__; frame-src https://www.youtube.com;`;

const DevServerHTTPSOptions = {
  key: fs.readFileSync(path.join(__dirname, "../certs/server/my-server.key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "../certs/server/my-server.crt.pem")),
  ca: fs.readFileSync(path.join(__dirname, "../certs/server/my-private-root-ca.crt.pem"))
};

const DevServerMiddleware = (req, res, next) => {
  const parsed = url.parse(req.url);
  const { pathname } = parsed;

  // If no dot and trailing slash, try rewriting /path to /path/index.html
  if (!pathname.includes(".") && !pathname.endsWith("/")) {
    parsed.pathname = pathname + "/index.html";
    req.url = url.format(parsed);
  }

  if (pathname.endsWith(".json")) {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  // Skip CSP for storybook
  if (pathname.includes(".storybook")) {
    return next();
  }

  res.setHeader("content-security-policy", CSP);
  return next();
};

const DevServer = options => {
  const { PORT, STATIC_ROOT } = options || {};

  const app = express();
  app.use(morgan("dev"));
  app.use(DevServerMiddleware);
  app.use(express.static(STATIC_ROOT));

  const server = https.createServer({ ...DevServerHTTPSOptions }, app);
  server.listen(PORT, () =>
    console.log("Test Pilot static dev server listening on port", PORT)
  );

  return { app, server };
};

module.exports = { DevServer, DevServerMiddleware, DevServerHTTPSOptions };
