#!/bin/sh
flake8 ./idea_town && ./manage.py test -v2
