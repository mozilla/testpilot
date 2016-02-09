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

# Ensure the Dockerrun file has the correct SERVER_NAME
cat > Dockerrun.aws.json << EOF
{
  "AWSEBDockerrunVersion": "1",
  "Image": {
    "Name": "$SERVER_NAME",
    "Update": "true"
  },
  "Logging": "/var/log/django",
  "Ports": [
    {
      "ContainerPort": "8000"
    }
  ]
}
EOF

# Prepare an app bundle for Elastic Beanstalk
mkdir -p build
zip -r build/eb-app-$TAG.zip Dockerrun.aws.json .ebextensions/*.config
