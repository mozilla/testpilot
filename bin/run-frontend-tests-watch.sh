#!/bin/sh

cd /root
NODE_PATH=/root/node_modules \
    ./node_modules/.bin/budo \
        /app/testpilot/frontend/static-src/test/browser.js:bundle.js \
        --verbose --live -- -t babelify -t require-globify
