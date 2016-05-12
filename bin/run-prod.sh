#!/bin/sh

./bin/run-common.sh
exec gunicorn testpilot.wsgi:application -b 0.0.0.0:${PORT:-8000} --log-file -
