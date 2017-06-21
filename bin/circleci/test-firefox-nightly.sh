#!/bin/bash
set -ex

mozinstall $(ls -t /home/ubuntu/firefox-downloads/firefox_nightly/*.tar.bz2 | head -1)
firefox --version
tox -e ui-tests
