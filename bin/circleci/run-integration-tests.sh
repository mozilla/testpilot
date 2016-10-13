#!/bin/bash

npm run server &
STATIC_SERVER_PID=$!

# Wait until the server is available...
until $(curl --output /dev/null --silent --head --fail http://testpilot.dev:8000); do
    printf '.'; sleep 1
done

# Fire up the integration tests with Marionette
python integration/runtests.py \
    --binary=$HOME/firefox/firefox-bin \
    --verbose \
    integration
TEST_STATUS=$?

kill $STATIC_SERVER_PID

# Report what happened
if [ $TEST_STATUS -eq 0 ]
then
  echo "Integration tests passed."
  exit 0
else
  echo "Integration tests failed!"
  exit 1
fi
