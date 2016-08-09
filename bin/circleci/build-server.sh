#!/bin/bash
set -ex

I="image-$(date +%j).tgz"

# build the container, use circleci's docker cache workaround
# only use 1 image per day to keep the cache size from getting
# too big and slowing down the build
if [[ -e ~/docker/$I ]]; then
    echo "Loading $I"
    pigz -d -c ~/docker/$I | docker load
fi

# build the actual deployment container
docker build -t app:build .

# Clean up any old images and save the new one
mkdir -p ~/docker
rm ~/docker/*
docker save app:build | pigz --fast -c > ~/docker/$I
ls -l ~/docker
