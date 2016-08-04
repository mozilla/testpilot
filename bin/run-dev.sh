#!/bin/sh

# HACK: Wait a while before starting up, to let postgres warm up and
# frontend_watcher to finish its first build
/bin/sleep 15

./bin/run-common.sh
./manage.py loaddata fixtures/initial_data_dev.json

# Try running this in a loop, so that the whole container doesn't exit when
# runserver reloads and hits an error
while [ 1 ]; do
    ./manage.py runserver 0.0.0.0:8000
    sleep 1
done
