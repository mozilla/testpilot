Idea Town
==========

![Idea Town Rainbow Logo](https://wiki.mozilla.org/images/thumb/7/7a/IdeaTownSticker.png/400px-IdeaTownSticker.png)

[![Build Status](https://img.shields.io/travis/mozilla/idea-town/master.svg)](https://travis-ci.org/mozilla/idea-town)

[![Coverage status](https://img.shields.io/coveralls/mozilla/idea-town/master.svg)](https://coveralls.io/r/mozilla/idea-town)

Idea Town is an opt-in platform that allows us to perform controlled tests of new high-visibility product concepts in the general release channel of Firefox.

Idea Town is not intended to replace trains for most features, nor is it a test bed for concepts we do not believe have a strong chance of shipping in general release. Rather, it is reserved for features that require user feedback, testing, and tuning before they ship with the browser.

## Repositories

* **idea-town** - Idea Town server and front-end
* [idea-town-splash](https://github.com/mozilla/idea-town-splash/) - Teaser site for collecting emails
* [idea-town-addon](https://github.com/mozilla/idea-town-addon/) - Idea Town add-on

## More Information

- Wiki: <https://wiki.mozilla.org/Idea_Town>
- IRC: #ideatown on irc.mozilla.org

## Development Setup

1. [Install Docker Toolbox](http://docs.docker.com/mac/started/)

2. Make sure you have a default Docker machine:

  `docker-machine create -driver virtualbox default`

3. Make sure your shell can see the default Docker machine:

  `eval "$(docker-machine env default)"`

4. Check the IP address of the default Docker machine:

  `docker-machine ip default`

5. Add an entry for `ideatown.dev` in your `/etc/hosts` pointing to the Docker machine IP

  `192.168.99.100 ideatown.dev`

  *This entry is necessary to support Firefox Accounts*

6. Create and setup the Docker containers:

  `docker-compose up`

  *this may take some time*

7. Visit the Django server:

  `open http://ideatown.dev:8000/`

  *you can also use whatever IP was reported by `docker ip` with port 8000*

### Notes

* To shell into one of the containers, e.g. to run Django commands:

  `docker exec -t -i ideatown_server_1 bash`

* If you change `package.json` to add dependencies for `gulpfile.js`, you must rebuild `client_build`:

  `docker-compose build client_build`

* If you change `requirements.txt` to add dependencies for Django, you must rebuild `server`:

  `docker-compose build server`

* Sometimes the database container hasn't fully started when the Django container wants to connect to it. If this happens:

  * `docker ps` to get the name of the Django container (something like `ideatown_server_1`)
  * `docker restart ideatown_server_1` to restart the Django container

* Sometimes `docker-compose build` seems to hang while building the `client_build` image. If this happens:

  * `docker rmi $(docker images -f dangling=true -q)` to remove any dangling images
  * `npm install` (it's not clear why this has an effect, but it seems to)
  * `docker-compose build`

[dc-bug]: https://github.com/docker/compose/issues/374

* If the client build container reports "app crashed waiting for file
  changes before starting", but never starts again - try this:

  `docker exec -t -i ideatown_client_build_1 touch gulpfile.js`

* Want to run Python linting and Django tests on file changes? Try this:
  ```bash
    sudo gem install kicker
    kicker -c -e'docker exec -t -i ideatown_server_1 flake8 ./idea_town && docker exec -t -i ideatown_server_1 ./manage.py test -v2' ./idea_town`
  ```

* You can customize settings for special development cases. For example, to
  switch to using S3 for media uploads:
  ```bash
    cp docker-compose-s3.yml-dist docker-compose-s3.yml
    # Edit docker-compose-s3.yml to include your AWS credentials
    docker-compose -f docker-compose-s3.yml build
    docker-compose -f docker-compose-s3.yml up
  ```
 

Testing
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
