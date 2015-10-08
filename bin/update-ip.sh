#!/bin/bash

# Gets the ip address of the server container and sets it in place in
# your /etc/hosts file.

IPBASE=`/sbin/ifconfig docker0 | grep 'inet addr:'| awk '{print $2}' | sed -e 's/.*://g' | cut -d '.' -f 1-2`
NEWIP=`docker inspect ideatown_server_1 | grep '"IPAddress' | awk '{sub(/["|,]/, "", $2); print $2}' | sed 's/["|,]//g'`

sed -ri 's/'$IPBASE'\.[0-9]{1,3}\.[0-9]{1,3}/'$NEWIP'/g' /etc/hosts
