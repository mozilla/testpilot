#!/bin/sh
flake8 ./testpilot && ./manage.py test -v2
