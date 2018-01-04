#!/bin/bash
set -ex
cd addon/
npm run package
cp *.rdf *.xpi $CIRCLE_ARTIFACTS/
