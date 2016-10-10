#!/bin/bash

# This file is used to deploy Test Pilot to an S3 bucket.  It expects to be run
# from the root of the Test Pilot directory and you'll need your S3 bucket name
# in an environment variable $TESTPILOT_BUCKET

# Questions?  Hit up #testpilot on IRC

if [ ! -d "dist" ]; then
    echo "Can't find /dist/ directory.  Are you running from the Test Pilot root?"
    exit 1
fi

if [ -z "$TESTPILOT_BUCKET" ]; then
    echo "The S3 bucket is not set. Failing."
    exit 1
fi


# The basic strategy is to sync all the files that need special attention
# first, and then sync everything else which will get defaults


# For short-lived assets; in seconds
MAX_AGE="600"

HPKP="\"public-key-pins\": \"max-age=300;pin-sha256='WoiWRyIOVNa9ihaBciRSC7XHjliYS9VwUGOIud4PB18=';pin-sha256='r/mIkG3eEpVdm+u/ko/cwxzOMo1bk4TyHIlByibiA5E='\""
CSP="\"content-security-policy\": \"default-src 'self'; connect-src 'self' analysis-output.telemetry.mozilla.org; font-src 'self' code.cdn.mozilla.net; form-action 'none'; object-src 'none'; script-src 'self' www.google-analytics.com; style-src 'self' code.cdn.mozilla.net; report-uri /__cspreport__;\""
HSTS="\"strict-transport-security\": \"max-age=31536000; includeSubDomains; preload\""
TYPE="\"x-content-type-options\": \"nosniff\""
FRAME="\"x-frame-options\": \"DENY\""
XSS="\"x-xss-protection\": \"1; mode=block\""

# HTML; 10 minute cache
aws s3 sync \
  --cache-control "max-age=${MAX_AGE}" \
  --content-type "text/html" \
  --exclude "*" \
  --include "*.html" \
  --metadata "{${HPKP}, ${CSP}, ${HSTS}, ${TYPE}, ${FRAME}, ${XSS}}" \
  --metadata-directive "REPLACE" \
  --acl "public-read" \
  dist/ s3://${TESTPILOT_BUCKET}/

# JSON; 10 minute cache
aws s3 sync \
  --cache-control "max-age=${MAX_AGE}" \
  --content-type "application/json" \
  --exclude "*" \
  --include "*.json" \
  --metadata "{${HPKP}, ${HSTS}}" \
  --metadata-directive "REPLACE" \
  --acl "public-read" \
  dist/ s3://${TESTPILOT_BUCKET}/

# XPI; 10 minute cache; amazon won't detect the content-type correctly
aws s3 sync \
  --cache-control "max-age=${MAX_AGE}" \
  --content-type "application/x-xpinstall" \
  --exclude "*" \
  --include "*.xpi" \
  --metadata "{${HPKP}, ${HSTS}}" \
  --metadata-directive "REPLACE" \
  --acl "public-read" \
  dist/ s3://${TESTPILOT_BUCKET}/

# RDF; 10 minute cache; amazon won't detect the content-type correctly
aws s3 sync \
  --cache-control "max-age=${MAX_AGE}" \
  --content-type "text/rdf" \
  --exclude "*" \
  --include "*.rdf" \
  --metadata "{${HPKP}, ${HSTS}}" \
  --metadata-directive "REPLACE" \
  --acl "public-read" \
  dist/ s3://${TESTPILOT_BUCKET}/

# SVG; cache forever, assign correct content-type
aws s3 sync \
  --content-type "image/svg+xml" \
  --exclude "*" \
  --include "*.svg" \
  --metadata "{${HPKP}, ${HSTS}}" \
  --metadata-directive "REPLACE" \
  --acl "public-read" \
  dist/ s3://${TESTPILOT_BUCKET}/

# Everything else; cache forever, because it has hashes in the filenames
aws s3 sync \
  --delete \
  --metadata "{${HPKP}, ${HSTS}}" \
  --metadata-directive "REPLACE" \
  --acl "public-read" \
  dist/ s3://${TESTPILOT_BUCKET}/
