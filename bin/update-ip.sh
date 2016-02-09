#!/bin/bash

# Gets the ip address of the server container and sets it in place in
# your /etc/hosts file.

# test if docker-machine exists
if [ -e docker-machine ]; then
    NEWIP=`docker-machine ip default`
else
    NEWIP=`docker inspect -f '{{ .NetworkSettings.IPAddress }}' testpilot_server_1`
fi

sed -i.bak 's/.* testpilot\.dev/'$NEWIP' testpilot.dev/g' /etc/hosts
