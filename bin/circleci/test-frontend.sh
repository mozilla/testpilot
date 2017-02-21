#!/bin/bash
set -ex

# build experiments.json
npm run content

npm run lint
MOCHA_FILE="$CIRCLE_TEST_REPORTS/junit/test-results.xml" npm run test:ci
