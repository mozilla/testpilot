Idea Town!
==========

[![Build Status](https://img.shields.io/travis/mozilla/idea-town/master.svg)](https://travis-ci.org/mozilla/idea-town)

[![Coverage status](https://img.shields.io/coveralls/mozilla/idea-town/master.svg)](https://coveralls.io/r/mozilla/idea-town)

yay all the ideas

## repos
* [idea-town](https://github.com/mozilla/idea-town/) Idea Town server and front end repo
* [idea-town-splash](https://github.com/mozilla/idea-town-splash/) Splash site for signups
* [idea-town-addon](https://github.com/mozilla/idea-town-addon/) Main addon

## Info
IRC: #ideatown

WIKI: https://wiki.mozilla.org/Idea-Town

## Hacking TL;DR

* [Install Docker](http://docs.docker.com/mac/started/) and docker-compose

* Make sure you have a default Docker machine, i.e.:
  * `docker-machine create -driver virtualbox default`

* Make sure your shell can see the default Docker machine, i.e.:
  * `eval "$(docker-machine env default)"`

* To see the IP address of the default Docker machine:
  * `docker-machine ip default`

* Add an entry for `ideatown.dev` in your `/etc/hosts` pointing to the Docker machine IP
  * `192.168.99.100 ideatown.dev`
  * This entry is necessary to support Firefox Accounts. (Possibly, also static
    assets in the future)

* Create & set up the Docker containers:
  * `docker-compose up`
  * This may take some time.
  * Note! A papercut: Sometimes the database container is not yet fully started
    up when the Django container wants to connect to it. When this happens, just
    try `docker-compose up` again. ([Ugh, this is a known bug in
    docker-compose][dc-bug]. Maybe we can find a workaround?)

* To visit the Django server:
  * `open http://ideatown.dev:8000/`
  * (or, whatever IP was reported by `docker ip` and port 8000)

* To shell into one of the containers, e.g. to run Django commands:
  * `docker exec -t -i ideatown_server_1 bash`

* If you change `package.json` to add dependencies for `gulpfile.babel.js`, you must rebuild `client_build`:
  * `docker-compose build client_build`

* If you change `requirements.txt` to add dependencies for Django, you must rebuild `server`:
  * `docker-compose build server`

[dc-bug]: https://github.com/docker/compose/issues/374

Run the tests
-------------

There's a sample test in `idea_town/base/tests.py` for your convenience, that
you can run using the following command:

    python manage.py test

If you want to run the full suite, with flake8 and coverage, you may use
[tox](https://testrun.org/tox/latest/). This will run the tests the same way
they are run by [travis](https://travis-ci.org)):

    pip install tox
    tox

The `.travis.yml` file will also run [coveralls](https://coveralls.io) by
default.

If you want to benefit from Travis and Coveralls, you will need to activate
them both for your project.

Oh, and you might want to change the "Build Status" and "Coverage Status" links
at the top of this file to point to your own travis and coveralls accounts.


Docker for development
----------------------

0. Make sure you have [docker](https://docker.io) and [docker-compose](https://github.com/docker/compose)
1. docker-compose up


Docker for deploying to production
-----------------------------------

1. Add your project in [Docker Registry](https://registry.hub.docker.com/) as [Automated Build](http://docs.docker.com/docker-hub/builds/)
2. Prepare a 'env' file with all the variables needed by dev, stage or production.
3. Run the image:

    docker run --env-file env -p 80:8000 mozilla/idea-town

Heroku
------
1. heroku create
2. heroku config:set DEBUG=False ALLOWED_HOSTS=<foobar>.herokuapp.com, SECRET_KEY=something_secret
   DATABASE_URL gets populated by heroku once you setup a database.
3. git push heroku master


NewRelic Monitoring
-------------------

A newrelic.ini file is already included. To enable NewRelic monitoring
add two enviroment variables:

 - NEW_RELIC_LICENSE_KEY
 - NEW_RELIC_APP_NAME

See the [full list of supported environment variables](https://docs.newrelic.com/docs/agents/python-agent/installation-configuration/python-agent-configuration#environment-variables).
