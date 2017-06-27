#!/bin/bash
set -ex

mozinstall $(ls -t /home/ubuntu/firefox-downloads/firefox_dev/*.tar.bz2 | head -1)
firefox --version
export PYTEST_ADDOPTS=--html=integration-test-results/ui-test-dev.html
tox -e ui-tests
