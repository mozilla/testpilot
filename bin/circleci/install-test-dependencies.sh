#!/bin/bash
set -ex

GECKODRIVER_URL=$(
  curl -s 'https://api.github.com/repos/mozilla/geckodriver/releases/latest' |
  python -c "import sys, json; r = json.load(sys.stdin); print([a for a in r['assets'] if 'linux64' in a['name']][0]['browser_download_url']);"
);

curl -L -o geckodriver.tar.gz $GECKODRIVER_URL
gunzip -c geckodriver.tar.gz | tar xopf -
chmod +x geckodriver
sudo mv geckodriver /home/ubuntu/bin
geckodriver --version

pip install tox mozdownload mozinstall

mkdir -p /home/ubuntu/firefox-downloads/
find /home/ubuntu/firefox-downloads/ -type f -mtime +90 -delete
mozdownload --version latest --destination /home/ubuntu/firefox-downloads/firefox/
mozdownload --version latest-beta --destination /home/ubuntu/firefox-downloads/firefox_dev/
mozdownload --version latest --type daily --destination /home/ubuntu/firefox-downloads/firefox_nightly/
