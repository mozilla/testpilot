#!/bin/bash

./manage.py migrate
./manage.py createinitialsuperuser
./manage.py updatefxaprovider
