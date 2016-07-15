#!/bin/sh

./manage.py migrate --noinput
./manage.py createinitialsuperuser
