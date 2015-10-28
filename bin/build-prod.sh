#!/bin/bash

SERVER_NAME=${1:-docker.io/lmorchard/idea-town:latest}
FRONTEND_BUILD_NAME=idea-town-frontend-build

# Build a container to run the frontend build tools
docker build -f Dockerfile-frontend-build -t $FRONTEND_BUILD_NAME .

# Run the frontend build tools
docker run -v $(pwd):/app $FRONTEND_BUILD_NAME

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
  "Ports": [
    {
      "ContainerPort": "8000"
    }
  ]
}
EOF

# Prepare an app bundle for Elastic Beanstalk
mkdir -p build
zip -r build/eb-app-latest.zip Dockerrun.aws.json .ebextensions/*.config
