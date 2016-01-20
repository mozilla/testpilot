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

## More Information

- Wiki: <https://wiki.mozilla.org/Idea_Town>
- IRC: #ideatown on irc.mozilla.org

## Development

### Quickstart

This project uses Docker in development. You'll get a lot of benefit
by acquainting yourself [with Docker and its documentation][docker-docs]. 
However, you can get started on Idea Town development with a minimum of Docker
know-how:

[docker-docs]: https://docs.docker.com/

#### OS X hosts

1. [Install Docker Toolbox](http://docs.docker.com/mac/started/)

2. Make sure you have a default Docker machine:

  `docker-machine create -driver virtualbox default`

3. Make sure the default machine is running:

  `docker-machine start default`

4. Make sure your shell can see the default Docker machine:

  `eval "$(docker-machine env default)"`

5. Check the IP address of the default Docker machine:

  `docker-machine ip default`

6. Use this IP address to add an entry for `ideatown.dev` in `/etc/hosts`:

  `192.168.99.100 ideatown.dev`

  You can do this manually, or the [bin/update-ip.sh][update-ip] script can
  take care of this for you.

[update-ip]: https://github.com/mozilla/idea-town/blob/master/bin/update-ip.sh

7. Create and setup the Docker containers (this will take some time):

  `docker-compose up`

#### Ubuntu Linux hosts

1. [Install Docker](http://docs.docker.com/linux/started/)

2. [Install Docker Compose](https://docs.docker.com/compose/install/)

3. Add an entry for `ideatown.dev` in `/etc/hosts`:

  `127.0.0.1 ideatown.dev`

  You can do this manually, or the [bin/update-ip.sh][update-ip] script can
  take care of this for you.

4. Create and setup the Docker containers (this will take some time):

  `sudo docker-compose up`

#### Windows hosts

* **Help wanted**: Getting things working on Windows may be similar to OS X,
  but the team has little experience with that environment.

### Next Steps

* Start editing files - changes should be picked up automatically.

* Visit the Django server, using the hostname you added to `/etc/hosts`:

  `http://ideatown.dev:8000/`

* Visit Django admin, login with username `admin` and password `admin`:

  `http://ideatown.dev:8000/admin/`

* For further reading:

  * [`README-DOCKER.md`](./README-DOCKER.md) - for more hints & tips on Docker in
    development, including how to set up custom configurations and run common
    tests & checks.

  * [`tox.ini`](./tox.ini) - to see what checks are run automatically in Travis
    CI, which you should ensure pass locally before submitting a Pull Request on
    GitHub

  * [`addon/README.md`](./addon/README.md) - for more details on the addon this
    site uses to enable advanced features.
