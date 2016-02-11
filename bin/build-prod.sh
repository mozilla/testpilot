#!/bin/bash

TAG=${1:-latest}
SERVER_NAME=${2:-docker.io/lmorchard/testpilot}:$TAG
FRONTEND_BUILD_NAME=testpilot-frontend-build
COMMIT=$(git rev-parse HEAD)

# Build a container to run the frontend build tools
docker build -f Dockerfile-frontend-build -t $FRONTEND_BUILD_NAME .

# Run the frontend build tools
docker run -v $(pwd):/app $FRONTEND_BUILD_NAME

echo $COMMIT > static/revision.txt

# Build the server image including the built frontend
docker build -t $SERVER_NAME .

# Push the images to the hub
docker push $SERVER_NAME
