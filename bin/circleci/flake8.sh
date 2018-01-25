#!/bin/bash
set -ex

# Skip builds for Pontoon commits
IS_PONTOON=$(git show -s --format=%s | grep -q 'Pontoon:' && echo 'true' || echo '')
if [[ $IS_PONTOON ]]; then
  echo "Skipping Integration Tests on Pontoon commit.";
  exit 0;
fi

tox -e flake8
