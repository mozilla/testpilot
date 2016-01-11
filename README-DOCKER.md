Idea Town Docker Dev Notes
==========================

Using Docker in development helps produce a consistent environment that's close
to the real production site. But, working with it is sometimes odd. This file
lists some hints & tips we've accumulated through the course of daily work.

* To shell into one of the containers:

  `docker exec -t -i ideatown_server_1 bash`

  This is necessary for running Django commands, among other things.

* To load some sample demo content into your Docker dev environment:

  `mkdir -p media`
  `cp -r fixtures/media/demo media/demo`
  `docker exec ideatown_server_1 ./manage.py loaddata fixtures/demo_data.json`

* Syntax & unit tests must pass for Pull Requests to be accepted on GitHub.

    * To run server checks:

      `docker exec -t -i ideatown_server_1 ./bin/run-dev-tests.sh`

    * To run frontend & addon checks:

      `docker exec -t -i ideatown_frontend_watcher_1 ./bin/run-frontend-tests.sh`

    * On OS X, the [`kicker`](https://github.com/alloy/kicker) utility might be
      handy for running these checks on local file changes:
      ```bash
        sudo gem install kicker
        kicker -c -e'docker exec -t -i ideatown_server_1 ./bin/run-dev-tests.sh' ./idea_town
        kicker -c -e'docker exec -t -i ideatown_frontend_watcher_1 ./bin/run-frontend-tests.sh' ./idea_town/frontend/static-src ./addon
      ```

* If you change `requirements.txt` to add dependencies for Django, you must rebuild `server`:

  `docker-compose build server`

* If you change `package.json` to add dependencies for `gulpfile.js`, you must rebuild `frontend_watcher`:

  `docker-compose build frontend_watcher`

* Sometimes the database container hasn't fully started when the Django container wants to connect to it. If this happens:

  * `docker ps` to get the name of the Django container (something like `ideatown_server_1`)
  * `docker restart ideatown_server_1` to restart the Django container

* [Issue #74](https://github.com/mozilla/idea-town/issues/74): Sometimes `docker-compose build` seems to hang while building the
  `frontend_watcher` image. If this happens:

  * `docker rmi $(docker images -f dangling=true -q)` to remove any dangling images
  * `npm install` (it's not clear why this has an effect, but it seems to)
  * `docker-compose build`

[dc-bug]: https://github.com/docker/compose/issues/374

* You can customize settings for special development cases. For example, to
  switch to using S3 for media uploads:
  ```bash
    cp docker-compose-s3.yml-dist docker-compose-s3.yml
    # Edit docker-compose-s3.yml to include your AWS credentials
    docker-compose -f docker-compose-s3.yml build
    docker-compose -f docker-compose-s3.yml up
  ```

* If you'd like to run Gulp on your host computer because there are issues
  running `frontend_watcher`, try this:
  ```
  docker-compose -f docker-compose-only-server.yml build
  docker-compose -f docker-compose-only-server.yml up
  ```
  Then, in a second terminal, you can run Gulp like this (assuming you have
  node.js installed locally):
  ```
  npm install
  gulp
  ```
