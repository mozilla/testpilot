Test Pilot
==========

![Test Pilot Logo](/testpilot/frontend/static-src/images/copter.png)

[![Circle CI](https://circleci.com/gh/mozilla/testpilot/tree/master.svg?style=svg&circle-token=88ea3e1a6d9b7558092b75358c6ab9251739b9b5)](https://circleci.com/gh/mozilla/testpilot/tree/master)
[![Coverage status](https://img.shields.io/coveralls/mozilla/testpilot/master.svg)](https://coveralls.io/r/mozilla/testpilot)
[![Requirements Status](https://requires.io/github/mozilla/testpilot/requirements.svg?branch=master)](https://requires.io/github/mozilla/testpilot/requirements/?branch=master)


Test Pilot is an opt-in platform that allows us to perform controlled tests of new high-visibility product concepts in the general release channel of Firefox.

Test Pilot is not intended to replace trains for most features, nor is it a test bed for concepts we do not believe have a strong chance of shipping in general release. Rather, it is reserved for features that require user feedback, testing, and tuning before they ship with the browser.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [More Information](#more-information)
- [Development](#development)
  - [Quickstart](#quickstart)
    - [OS X hosts](#os-x-hosts)
    - [Ubuntu Linux hosts](#ubuntu-linux-hosts)
    - [Windows hosts](#windows-hosts)
  - [Next Steps](#next-steps)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## More Information

- Wiki: https://wiki.mozilla.org/Test_Pilot
- IRC: #testpilot on irc.mozilla.org
- [Test Pilot Metrics](docs/README-METRICS.md)

## Development

### Quickstart

This project uses Docker in development. You'll get a lot of benefit
by acquainting yourself [with Docker and its documentation][docker-docs].
However, you can get started on Test Pilot development with a minimum of Docker
know-how:

[docker-docs]: https://docs.docker.com/

By default `js-lint` and `sass-lint` watch options are set to true. If you would like
to override these, you can do so in [debug-config.json](./debug-config.json).
if you'd like to run linters on `pre-commit` you can use this [pre-commit-hook](https://gist.github.com/meandavejustice/39f7edc046f3458aa076).

See some of our [Tips and Tricks](docs/README-DOCKER.md).

#### First Thing's First

Make sure you clone the Test Pilot repo: 

  `git clone https://github.com/mozilla/testpilot.git`

#### OS X hosts

1. [Install Docker Toolbox](https://docs.docker.com/toolbox/toolbox_install_mac/)

2. Make sure you have a default Docker machine:

  `docker-machine create --driver virtualbox default`

3. Make sure the default machine is running:

  `docker-machine start default`

4. Make sure your shell can see the default Docker machine:

  `eval "$(docker-machine env default)"`

5. Check the IP address of the default Docker machine:

  `docker-machine ip default`

6. Use this IP address to add an entry for `testpilot.dev` in `/etc/hosts`:

  `192.168.99.100 testpilot.dev`

  You can do this manually, or the [bin/update-ip.sh][update-ip] script can
  take care of this for you.

[update-ip]: https://github.com/mozilla/testpilot/blob/master/bin/update-ip.sh

7. Don't forget to cd into your Test Pilot directory:

  `cd testpilot`

8. Create and setup the Docker containers (this will take some time):

  `docker-compose up`

#### Ubuntu Linux hosts

1. [Install Docker](http://docs.docker.com/linux/started/)

2. [Install Docker Compose](https://docs.docker.com/compose/install/)

3. Add an entry for `testpilot.dev` in `/etc/hosts`:

  `127.0.0.1 testpilot.dev`

  You can do this manually, or the [bin/update-ip.sh][update-ip] script can
  take care of this for you.

4. Don't forget to cd into your Test Pilot directory:

  `cd testpilot`

5. Create and setup the Docker containers (this will take some time):

  `sudo docker-compose up`

#### Windows hosts

* **Help wanted**: Getting things working on Windows may be similar to OS X,
  but the team has little experience with that environment.

### Next Steps

* Start editing files - changes should be picked up automatically.

* Visit the Django server, using the hostname you added to `/etc/hosts`:

  `http://testpilot.dev:8000/`

* Visit Django admin, login with username `admin` and password `admin`:

  `http://testpilot.dev:8000/admin/`

* For further reading:

  * [`README-DOCKER.md`](./docs/README-DOCKER.md) - for more hints & tips on Docker in
    development, including how to set up custom configurations and run common
    tests & checks.

  * [`circle.yml`](./circle.yml) - to see what checks are run automatically in Circle
    CI, which you should ensure pass locally before submitting a Pull Request on
    GitHub

  * [`addon/README.md`](./addon/README.md) - for more details on the addon this
    site uses to enable advanced features.

  * [`docs/WORK.md`](./docs/WORK.md) - information on how we create, triage and assign work.

  * [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) - process for deploying Test Pilot to stage and production.

  * [`docs/FAQs.md`](./docs/FAQs.md) - frequently asked questions.
