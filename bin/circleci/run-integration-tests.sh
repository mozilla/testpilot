#!/bin/bash

if [[ " $TESTPILOT_STATIC_BRANCHES " =~ " $CIRCLE_BRANCH " ]]; then
    npm run server &
    STATIC_SERVER_PID=$!
else
    # Fire up an instance of the site configured for integration testing
    docker run \
        --name integration \
        --detach \
        --net=host \
        -p 127.0.0.1:8000:8000 \
        -e 'DEBUG=False' \
        -e 'SECRET_KEY=Foo' \
        -e 'ALLOWED_HOSTS=testpilot.dev' \
        -e 'DATABASE_URL=postgres://ubuntu@localhost/circle_test' \
        app:build \
        bin/circleci/run-integration-test-server.sh
fi

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

if [[ " $TESTPILOT_STATIC_BRANCHES " =~ " $CIRCLE_BRANCH " ]]; then
    kill $STATIC_SERVER_PID
else
    # Clean up - these commands will sometimes produce errors, but ignore them
    docker kill integration
    docker rm integration
fi

# Report what happened
if [ $TEST_STATUS -eq 0 ]
then
  echo "Integration tests passed."
  exit 0
else
  echo "Integration tests failed!"
  exit 1
fi
