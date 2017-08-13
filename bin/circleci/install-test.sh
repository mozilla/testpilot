#!/bin/bash
export PYTEST_ADDOPTS=--html=integration-test-results/ui-test-dev.html
curl -L -o firefox_nightly.tar.bz2 https://archive.mozilla.org/pub/firefox/nightly/2017/08/2017-08-04-18-00-22-mozilla-central/firefox-57.0a1.en-US.linux-x86_64.tar.bz2
mozinstall firefox_nightly.tar.bz2
firefox --version
cd addon/
npm run package
cd ..
npm start &
tox -e ui-tests
