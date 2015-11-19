#!/bin/bash

./manage.py migrate
./manage.py collectstatic --noinput
./manage.py createinitialsuperuser
./manage.py updatefxaprovider
