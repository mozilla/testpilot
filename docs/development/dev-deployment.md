[👈 Back to README](../../README.md)

The current stack at testpilot.dev.mozaws.net consists of these parts in CircleCI and [cloudservices-aws-dev](https://mana.mozilla.org/wiki/display/SVCOPS/Requesting+A+Dev+IAM+account+from+Cloud+Operations):

* [CircleCI](../../circle.yml) deployment via [`bin/deploy.sh`](../../bin/deploy.sh) on every master branch commit that passes tests
* S3 bucket ([`testpilot.dev.mozaws.net`](https://s3.console.aws.amazon.com/s3/buckets/testpilot.dev.mozaws.net/?region=us-east-1&tab=overview))
* CloudFront distribution ([`E2ERG47PHCWD0Z`](https://console.aws.amazon.com/cloudfront/home?region=us-east-1#distribution-settings:E2ERG47PHCWD0Z))
* Lambda@Edge function [borrowed from mozilla-services/cloudops-deployment](https://github.com/mozilla-services/cloudops-deployment/blob/5b80e655a43869dec2a0c9b8cb3bd2e54758939d/projects/testpilot/ansible/templates/resources.yml#L186) on the CloudFront Viewer Response event for header transformation ([`arn:aws:lambda:us-east-1:927034868273:function:testpilot-dev-headers-transform`](https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/testpilot-dev-headers-transform))

All of the above was configured manually, since we only seem to change this
stuff once or twice per year. Our staging and production servers are managed by
the cloudops team, who have this stuff automated.

Since the mozilla-services/cloudops-deployment repository is private, here's
the source of the Lambda@Edge function we're using on Viewer Response:
```javascript
"use strict";
// see: https://github.com/mozilla-services/cloudops-deployment/blob/5b80e655a43869dec2a0c9b8cb3bd2e54758939d/projects/testpilot/ansible/templates/resources.yml#L186

exports.handler = (event, context, callback) => {
  const response = event.Records[0].cf.response;
  const headers = response.headers;
  const new_headers = {};
  Object.keys(headers).forEach(function(h) {
    if (h.substring(0, 11) === "x-amz-meta-") {
      new_headers[h.substring(11)] = headers[h].map(function(o) {
        o.key = o.key.substring(11);
        return o;
      });
    } else {
      new_headers[h] = headers[h];
    }
  });
  response.headers = new_headers;
  callback(null, response);
};
```
Nothing sensitive here, just a workaround for a limitation in Amazon S3 wherein
we need to set custom headers on resources and S3 does not support it.
