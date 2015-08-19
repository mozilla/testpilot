#!/bin/sh
./bin/run-common.sh
./manage.py loaddata fixtures/initial_data_dev.json
./manage.py runserver 0.0.0.0:8000
