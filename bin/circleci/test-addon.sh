#!/bin/bash
set -ex
cd addon/
npm run lint
npm test -- --binary=$HOME/firefox/firefox-bin
npm run lint-addon
