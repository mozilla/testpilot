#!/bin/bash
set -ex

mozdownload --version latest-beta --destination firefox_dev.tar.bz2
mozinstall firefox_dev.tar.bz2
firefox --version
tox
