#!/bin/bash

# TODO XXX We should re-enable our integration tests!
#  * flaky tests are worse than no tests
#  * Jared is going to look at having the integration tests hit t.f.c/files/
#    directly which would still test the install, but would bypass all of the
#    hard-to-hit prompts (hopefully fixing the flakiness?)
#  * disabling these now lets us land greenkeeper and update a lot of out of
#    date libraries (~25)
#  * r=_6a68 and r=clouserw.  Conveniently discussed over the holiday break ;)
exit 0

npm start &
STATIC_SERVER_PID=$!

# Wait until the server is available...
until $(curl --output /dev/null --silent --head --fail http://testpilot.dev:8000); do
    printf '.'; sleep 1
done

# Fire up the integration tests with Marionette
python integration/runtests.py \
    --binary=$HOME/firefox/firefox-bin \
    --verbose \
    integration/test_installation.py
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
