[👈 Back to README](../../README.md)

The current stack at testpilot.dev.mozaws.net consists of these parts in cloudservices-aws-dev:

* S3 bucket (`testpilot.dev.mozaws.net`)
* Nginx proxy in EC2 (`i-0a49cc4d7ea523a5e`)
* CloudFront distribution (`E2ERG47PHCWD0Z`)

The S3 bucket is automated - `bin/deploy.sh` uploads to it on every merge to master via CircleCI. The CloudFront distribution is also simple - it just points at the Nginx proxy, which in turn points at the S3 bucket.

The Nginx proxy, however, is currently a manual thing for expediency's sake:
1. Fired up an Amazon Linux instance on EC2 and [installed Docker on it manually](http://docs.aws.amazon.com/AmazonECS/latest/developerguide/docker-basics.html).
1. Built a Docker container for the [`header-proxy`](https://github.com/mozilla/testpilot/tree/master/header-proxy) configuration
1. [Pushed the container to Docker Hub](https://hub.docker.com/r/lmorchard/txp-proxy/tags/).
1. Then I started up the Docker container with
  ```
  docker pull lmorchard/txp-proxy
  docker run -d -p 80:80 lmorchard/txp-proxy
  ```
Except for the first step, all of the above needs to be re-done manually whenever the proxy config changes or if the instance happens to crash (e.g. `docker ps && docker kill {old-container} && docker pull && docker run`). This *should* be rare, so to get the new stack up & out the door I didn't build automation to build & deploy like we used to have with Docker & Elastic Beanstalk.

