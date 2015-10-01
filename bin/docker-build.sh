#!/bin/bash

# This is an absolutely terrible shell script which should always
# successfully rebuild the client image, and probably also always
# emit confusing semi-meaningless error messages.

# test if docker-machine exists
if [ -e docker-machine ]; then
    docker-machine create -driver virtualbox default
    docker-machine start default
    eval "$(docker-machine env default)"
fi

docker rmi $(docker images -f dangling=true -q)
npm install
docker-compose build
docker-compose up
