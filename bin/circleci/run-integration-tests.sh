#!/bin/bash
end=$((SECONDS+60))

npm run server &
STATIC_SERVER_PID=$!
# Wait until the server is available...
while [ $SECONDS != $end ]; do
  curl --output /dev/null --silent --head --fail -k https://example.com:8000;
done
