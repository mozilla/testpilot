#!/bin/bash

# This file is used to deploy Test Pilot to an S3 bucket.  It expects to be run
# from the root of the Test Pilot directory and you'll need your S3 bucket name
# in an environment variable $TESTPILOT_BUCKET
#
# It takes a single argument:  If you're deploying to a dev instance, pass in
# "dev" and it will tweak the rules slightly:
#
#   ./deploy.sh dev
#
# Questions?  Hit up #testpilot on IRC

if [ ! -d "dist" ]; then
    echo "Can't find /dist/ directory.  Are you running from the Test Pilot root?"
    exit 1
fi

if [ -z "$TESTPILOT_BUCKET" ]; then
    echo "The S3 bucket is not set. Failing."
    exit 1
fi

if [ "$1" = "dev" ]; then
    DEST="dev"
fi


# The basic strategy is to sync all the files that need special attention
# first, and then sync everything else which will get defaults


# For short-lived assets; in seconds
TEN_MINUTES="600"

# For long-lived assets; in seconds
ONE_YEAR="31536000"

HPKP="\"Public-Key-Pins\": \"max-age=300;pin-sha256=\\\"WoiWRyIOVNa9ihaBciRSC7XHjliYS9VwUGOIud4PB18=\\\";pin-sha256=\\\"r/mIkG3eEpVdm+u/ko/cwxzOMo1bk4TyHIlByibiA5E=\\\";pin-sha256=\\\"YLh1dUR9y6Kja30RrAn7JKnbQG/uEtLMkBgFF2Fuihg=\\\";pin-sha256=\\\"sRHdihwgkaib1P1gxX8HFszlD+7/gTfNvuAybgLPNis=\\\";\""
CSP="\"content-security-policy\": \"default-src 'self'; connect-src 'self' https://sentry.prod.mozaws.net https://www.google-analytics.com https://ssl.google-analytics.com https://basket.mozilla.org https://analysis-output.telemetry.mozilla.org; font-src 'self' code.cdn.mozilla.net; form-action 'none'; frame-ancestors 'self'; img-src 'self' https://ssl.google-analytics.com https://www.google-analytics.com; object-src 'none'; script-src 'self' https://ssl.google-analytics.com; style-src 'self' code.cdn.mozilla.net; report-uri /__cspreport__;\""
HSTS="\"strict-transport-security\": \"max-age=${ONE_YEAR}; includeSubDomains; preload\""
TYPE="\"x-content-type-options\": \"nosniff\""
XSS="\"x-xss-protection\": \"1; mode=block\""

# Our dev server has a couple different rules to allow easier debugging and
# enable localization.  Also expires more often.
if [ "$DEST" = "dev" ]; then
    TEN_MINUTES="15"
    ONE_YEAR="15"
    CSP="\"content-security-policy\": \"default-src 'self'; connect-src 'self' https://sentry.prod.mozaws.net https://www.google-analytics.com https://ssl.google-analytics.com https://basket.mozilla.org https://analysis-output.telemetry.mozilla.org; font-src 'self' code.cdn.mozilla.net; form-action 'none'; frame-ancestors 'self' https://pontoon.mozilla.org; img-src 'self' https://pontoon.mozilla.org https://ssl.google-analytics.com https://www.google-analytics.com; object-src 'none'; script-src 'self' https://pontoon.mozilla.org https://ssl.google-analytics.com; style-src 'self' https://pontoon.mozilla.org code.cdn.mozilla.net; report-uri /__cspreport__;\""
fi

# build version.json if it isn't provided
[ -e version.json ] || $(dirname $0)/build-version-json.sh

if [ -e version.json ]; then
    mv version.json dist/__version__
    # __version__ JSON; short cache
    aws s3 cp \
      --cache-control "max-age=${TEN_MINUTES}" \
      --content-type "application/json" \
      --metadata "{${HPKP}, ${HSTS}, ${TYPE}}" \
      --metadata-directive "REPLACE" \
      --acl "public-read" \
      dist/__version__ s3://${TESTPILOT_BUCKET}/__version__
fi

# HTML; short cache
aws s3 sync \
  --cache-control "max-age=${TEN_MINUTES}" \
  --content-type "text/html" \
  --exclude "*" \
  --include "*.html" \
  --metadata "{${HPKP}, ${CSP}, ${HSTS}, ${TYPE}, ${XSS}}" \
  --metadata-directive "REPLACE" \
  --acl "public-read" \
  dist/ s3://${TESTPILOT_BUCKET}/

# JSON; short cache
aws s3 sync \
  --cache-control "max-age=${TEN_MINUTES}" \
  --content-type "application/json" \
  --exclude "*" \
  --include "*.json" \
  --metadata "{${HPKP}, ${HSTS}, ${TYPE}}" \
  --metadata-directive "REPLACE" \
  --acl "public-read" \
  dist/ s3://${TESTPILOT_BUCKET}/

# XPI; short cache; amazon won't detect the content-type correctly
aws s3 sync \
  --cache-control "max-age=${TEN_MINUTES}" \
  --content-type "application/x-xpinstall" \
  --exclude "*" \
  --include "*.xpi" \
  --metadata "{${HPKP}, ${HSTS}, ${TYPE}}" \
  --metadata-directive "REPLACE" \
  --acl "public-read" \
  dist/ s3://${TESTPILOT_BUCKET}/

# RDF; short cache; amazon won't detect the content-type correctly
aws s3 sync \
  --cache-control "max-age=${TEN_MINUTES}" \
  --content-type "text/rdf" \
  --exclude "*" \
  --include "*.rdf" \
  --metadata "{${HPKP}, ${HSTS}, ${TYPE}}" \
  --metadata-directive "REPLACE" \
  --acl "public-read" \
  dist/ s3://${TESTPILOT_BUCKET}/

# SVG; cache forever, assign correct content-type
aws s3 sync \
  --cache-control "max-age=${ONE_YEAR}" \
  --content-type "image/svg+xml" \
  --exclude "*" \
  --include "*.svg" \
  --metadata "{${HPKP}, ${HSTS}, ${TYPE}}" \
  --metadata-directive "REPLACE" \
  --acl "public-read" \
  dist/ s3://${TESTPILOT_BUCKET}/

# Everything else; cache forever, because it has hashes in the filenames
aws s3 sync \
  --delete \
  --cache-control "max-age=${ONE_YEAR}" \
  --metadata "{${HPKP}, ${HSTS}, ${TYPE}}" \
  --metadata-directive "REPLACE" \
  --acl "public-read" \
  dist/ s3://${TESTPILOT_BUCKET}/

# HTML - `path/index.html` to `path` resources; short cache
for fn in $(find dist -name 'index.html' -not -path 'dist/index.html'); do
  s3path=${fn#dist/}
  s3path=${s3path%/index.html}
  aws s3 cp \
    --cache-control "max-age=${TEN_MINUTES}" \
    --content-type "text/html" \
    --exclude "*" \
    --include "*.html" \
    --metadata "{${HPKP}, ${CSP}, ${HSTS}, ${TYPE}, ${XSS}}" \
    --metadata-directive "REPLACE" \
    --acl "public-read" \
    $fn s3://${TESTPILOT_BUCKET}/${s3path}
done
