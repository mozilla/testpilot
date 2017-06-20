#!/bin/bash
set -ex

mozdownload --version latest --destination firefox.tar.bz2
mozinstall firefox.tar.bz2
firefox --version
tox
