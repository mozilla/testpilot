#!/bin/bash
set -ex

# TODO: Update this occasionally from here:
# https://wiki.mozilla.org/Add-ons/Extension_Signing#Unbranded_Builds
FIREFOX_URL=http://archive.mozilla.org/pub/firefox/tinderbox-builds/mozilla-release-linux64-add-on-devel/1470649852/firefox-48.0.1.en-US.linux-x86_64-add-on-devel.tar.bz2

wget -qO $HOME/fx-release.tar.bz2 $FIREFOX_URL
tar -C $HOME -jxf $HOME/fx-release.tar.bz2
$HOME/firefox/firefox-bin --version

# cd integration
# pip install -r requirements.txt
