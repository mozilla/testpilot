#!/bin/bash
set -ex
cd addon/
# only sign when on master branch or a tag
if [[ $CIRCLE_PROJECT_USERNAME == 'mozilla' && ($CIRCLE_BRANCH == 'master' || $CIRCLE_TAG != '') ]]; then
    npm run sign;
else
    npm run package;
fi
cp *.rdf *.xpi $CIRCLE_ARTIFACTS/
