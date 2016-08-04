Test Pilot Docker Dev Notes
==========================

Using Docker in development helps produce a consistent environment that's close
to the real production site. But, working with it is sometimes odd. This file
lists some hints & tips we've accumulated through the course of daily work.

### To shell into the containers:

* `docker exec -t -i testpilot_frontend_watcher_1 sh`
* `docker exec -t -i testpilot_server_1 sh`

This is necessary for running Django commands, among other things.

### To load some sample demo content into your Docker dev environment:
```
mkdir -p media
cp -r fixtures/media/demo media
docker exec testpilot_server_1 ./manage.py loaddata fixtures/demo_data.json
```

### Syntax & unit tests for Pull Requests to be accepted on GitHub.

* To run server linting & tests:

  `docker exec testpilot_server_1 ./bin/run-dev-tests.sh`

* To run frontend & addon code linting:

  `docker exec testpilot_frontend_watcher_1 ./bin/run-frontend-lint.sh`

* To start a file watcher for frontend tests:

  `docker exec testpilot_frontend_watcher_1 ./bin/run-frontend-tests-watch.sh`

  Then, open http://testpilot.dev:9966/ in a browser to see test results.

* On OS X, the [`kicker`](https://github.com/alloy/kicker) utility might be
  handy for running checks on local file changes:
  ```bash
    sudo gem install kicker
    kicker -c -e'docker exec -t -i testpilot_server_1 ./bin/run-dev-tests.sh' ./testpilot
    kicker -c -e'docker exec -t -i testpilot_frontend_watcher_1 ./bin/run-frontend-tests.sh' ./testpilot/frontend/static-src ./addon
  ```

### Rebuilding when Python (requirements.txt) or Node (package.json) dependencies change

* `docker-compose build server`
* `docker-compose build frontend_watcher`

### Database errors and 500 errors in Django

Sometimes the database container hasn't fully started when the Django container
wants to connect to it. If this happens:

* `docker ps` to get the name of the Django container (something like `testpilot_server_1`)
* `docker restart testpilot_server_1` to restart the Django container

### [Issue #74](https://github.com/mozilla/testpilot/issues/74): Sometimes `docker-compose build` seems to hang while building the `frontend_watcher` image. 

* `docker rmi $(docker images -f dangling=true -q)` to remove any dangling images
* `npm install` (it's not clear why this has an effect, but it seems to)
* `docker-compose build`

[dc-bug]: https://github.com/docker/compose/issues/374

### Customizing settings for special development cases. 

For example, to switch to using S3 for media uploads:
```bash
cp docker-compose-s3.yml-dist docker-compose-s3.yml
# Edit docker-compose-s3.yml to include your AWS credentials
docker-compose -f docker-compose-s3.yml build
docker-compose -f docker-compose-s3.yml up
```

### If you'd like to run Gulp on your host computer

(e.g. because there are issues running `frontend_watcher`)
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
