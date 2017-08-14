#!/bin/bash
set -ex

# Skip builds for Pontoon commits
IS_PONTOON=$(git show -s --format=%s | grep -q 'Pontoon:' && echo 'true' || echo '')
if [[ $IS_PONTOON ]]; then
  echo "Skipping Integration Tests on Pontoon commit.";
  exit 0;
fi

mozinstall $(ls -t /home/ubuntu/firefox-downloads/firefox_nightly/*.tar.bz2 | head -1)
firefox --version
export PYTEST_ADDOPTS=--html=integration-test-results/ui-test-nightly.html
tox -e ui-tests
