#!/bin/bash
set -ex

npm run lint
MOCHA_FILE="$CIRCLE_TEST_REPORTS/junit/test-results.xml" npm run test:ci
