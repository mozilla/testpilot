#!/bin/bash
set -ex

docker run \
    --net=host \
    -e 'DEBUG=False' \
    -e 'SECRET_KEY=Foo' \
    -e 'ALLOWED_HOSTS=localhost' \
    -e 'DATABASE_URL=postgres://ubuntu@localhost/circle_test' \
    --user root \
    app:build \
    sh -c 'flake8 testpilot && ./manage.py test -v2 testpilot'
