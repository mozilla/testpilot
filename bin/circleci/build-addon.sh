#!/bin/bash
set -ex
cd addon/
npm config set spin false
npm install
npm run lint
npm test -- --binary=$HOME/firefox/firefox-bin
# only sign when on master branch or a tag
if [[ $CIRCLE_BRANCH == 'master' || $CIRCLE_TAG != '' ]]; then
    npm run sign;
else
    npm run package;
fi
npm run lint-addon
