[👈 Back to README](../../README.md)

# Development Quickstart

This project uses Docker in development. You'll get a lot of benefit
by acquainting yourself [with Docker and its documentation][docker-docs].
However, you can get started on Test Pilot development with a minimum of Docker
know-how:

[docker-docs]: https://docs.docker.com/

By default `js-lint` and `sass-lint` watch options are set to true. If you would like
to override these, you can do so in [debug-config.json](./debug-config.json).
if you'd like to run linters on `pre-commit` you can use this [pre-commit-hook](https://gist.github.com/meandavejustice/39f7edc046f3458aa076).

See some of our [Tips and Tricks](docs/README-DOCKER.md).

## First Things First

Make sure you clone the Test Pilot repo:

  `git clone https://github.com/mozilla/testpilot.git`

### OS X hosts

1. [Install Docker for Mac](https://docs.docker.com/engine/installation/mac/)

  Note: Docker for Mac is pretty new.  If you used to use the Docker
  Toolkit read [the transition notes](https://docs.docker.com/docker-for-mac/docker-toolbox/).

2. Add an entry for `testpilot.dev` in `/etc/hosts`:

  `127.0.0.1 testpilot.dev`

3. Don't forget to cd into your Test Pilot directory:

  `cd testpilot`

4. Create and setup the Docker containers (this will take some time):

  `docker-compose up`

### Ubuntu Linux hosts

1. [Install Docker](https://docs.docker.com/engine/installation/linux/ubuntulinux/)

2. [Install Docker Compose](https://docs.docker.com/compose/install/)

3. Add an entry for `testpilot.dev` in `/etc/hosts`:

  `127.0.0.1 testpilot.dev`

4. Don't forget to cd into your Test Pilot directory:

  `cd testpilot`

5. Create and setup the Docker containers (this will take some time):

  `docker-compose up`

### Windows hosts

* **Help wanted**: Getting things working on Windows may be similar to OS X,
  but the team has little experience with that environment.

## Next Steps

* Start editing files - changes should be picked up automatically.

* Visit the Django server, using the hostname you added to `/etc/hosts`:

  `http://testpilot.dev:8000/`

* Visit Django admin, login with username `admin` and password `admin`:

  `http://testpilot.dev:8000/admin/`
