#!/bin/bash
set -ex
if [[ $CIRCLE_BRANCH == 'master' ]]; then
    NODE_ENV=production ENABLE_PONTOON=1 ENABLE_DEV_CONTENT=1 ENABLE_DEV_LOCALES=1 npm run static
else
    NODE_ENV=production ENABLE_PONTOON=0 ENABLE_DEV_CONTENT=0 ENABLE_DEV_LOCALES=0 npm run static
fi
