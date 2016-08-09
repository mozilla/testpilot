#!/bin/sh
./bin/run-common.sh
./manage.py loaddata fixtures/initial_data_dev.json
mkdir -p media
cp -r fixtures/media/demo media
./manage.py loaddata fixtures/demo_data.json
./manage.py runserver 0.0.0.0:8000
