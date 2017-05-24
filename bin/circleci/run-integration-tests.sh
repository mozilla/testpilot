#!/bin/bash

npm start &
STATIC_SERVER_PID=$!

# Wait until the server is available...
until $(curl --output /dev/null --silent --head --fail -k https://example.com:8000); do
    printf '.'; sleep 1
done
