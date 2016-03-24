#!/bin/bash

SHA1=$1

# Deploy image to Docker Hub
# docker tag app:build ${DOCKERHUB_REPO}:$SHA
# docker push ${DOCKERHUB_REPO}:$SHA

# Create new Elastic Beanstalk version
APP_NAME=testpilot-dev
ENV_NAME=testpilot-dev
EB_BUCKET=elasticbeanstalk-us-east-1-927034868273

APP_BUNDLE=${APP_NAME}-${ENV_NAME}-latest-app.zip

# In case we stop deploying strictly from :latest, we can use <TAG> to specify
sed "s/<TAG>/$SHA1/" < Dockerrun.aws.json-template > Dockerrun.aws.json

# HACK: This seems like it should be covered by the v1 configuration template,
# but this encantation seems necessary to get configuration carried over.
mkdir -p .ebextensions
aws s3 cp s3://$EB_BUCKET/resources/templates/$APP_NAME/00-environment.config \
          .ebextensions/00-environment.config
zip -r $APP_BUNDLE Dockerrun.aws.json .ebextensions/*.config

aws s3 cp $APP_BUNDLE s3://$EB_BUCKET/$APP_BUNDLE

aws elasticbeanstalk create-application-version \
    --application-name $APP_NAME \
    --version-label $SHA1 \
    --source-bundle S3Bucket=$EB_BUCKET,S3Key=$APP_BUNDLE

# Update Elastic Beanstalk environment to new version
aws elasticbeanstalk update-environment \
    --template-name v1 \
    --environment-name $ENV_NAME \
    --version-label $SHA1
