#!/bin/bash
set -ex
printf '{"commit":"%s","version":"%s","source":"https://github.com/%s/%s","build":"%s"}\n' \
    "$CIRCLE_SHA1" \
    "$CIRCLE_TAG" \
    "$CIRCLE_PROJECT_USERNAME" \
    "$CIRCLE_PROJECT_REPONAME" \
    "$CIRCLE_BUILD_URL" \
    > version.json
cat version.json
