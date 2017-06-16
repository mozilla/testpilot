#!/bin/bash
set -ex

npm run lint
npm run l10n:check
npm run flow
MOCHA_FILE="$CIRCLE_TEST_REPORTS/junit/test-results.xml" npm run test:ci
