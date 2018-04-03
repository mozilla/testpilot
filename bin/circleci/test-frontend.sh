#!/bin/bash
set -ex

npm run lint
npm run l10n:check
npm run flow
npm run test:ci
