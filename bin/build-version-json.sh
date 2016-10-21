#!/bin/bash

echo "$(dirname $0)"
cd $(dirname $0)/..

HASH=$(git --no-pager log --format=format:"%H" -1)
TAG=$(git show-ref --tags | awk "/$HASH/ {print \$NF}" | sed 's/refs.tags.//')

printf '{"commit":"%s","version":"%s","source":"https://github.com/mozilla/testpilot"}\n' \
    "$HASH" \
    "$TAG" \
    > version.json

cat version.json
