#!/bin/sh

./manage.py migrate --noinput
./manage.py createinitialsuperuser
./manage.py updatefxaprovider
