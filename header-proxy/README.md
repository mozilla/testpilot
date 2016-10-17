Header transformation proxy for Test Pilot S3 deployments
---------------------------------------------------------

Amazon S3 does not allow us to set arbitrary HTTP headers on resources we
upload. However, we need to serve up particular headers with Test Pilot
resources to satisfy various security concerns. So, we have a proxy that sits
in between Amazon S3 and our CloudFront distribution to transform what headers
S3 *does* let us set into their correct forms.

This directory contains an `nginx.conf` that configures an Nginx server as a
reverse proxy for an Amazon S3 bucket to which a build of Test Pilot has been
uploaded with the `bin/deploy.sh` script.

Deployment for testpilot.dev.mozaws.net
=======================================

This is running on a single EC2 instance named "Test Pilot dev HTTP proxy" on
the Mozilla Cloud Services AWS account. The instance is based on the plain
Amazon Linux image, with the following commands manually applied:

```bash
sudo yum update -y
sudo yum install -y docker
sudo docker run -d -p 80:80 lmorchard/txp-proxy
```

Local development
=================

You shouldn't normally need this proxy. But, if by some chance you need to run
it locally, you can use like so:

```bash
docker build -t txp-proxy .
docker run -p 8000:80 txp-proxy
```
