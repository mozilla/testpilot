#!/bin/bash
set -ex
npm install
if [[ " $TESTPILOT_STATIC_BRANCHES " =~ " $CIRCLE_BRANCH " ]]; then
    npm run static
else
    npm run build
fi
# TODO: Re-enable when we have working tests again
# npm test
