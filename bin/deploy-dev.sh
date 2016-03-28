#!/bin/bash

SHA1=$1

APP_NAME=testpilot-dev
ENV_NAME=testpilot-dev
CONFIG_TEMPLATE_NAME=testpilot-dev-v1
EB_BUCKET=elasticbeanstalk-us-east-1-927034868273
DOCKERRUN_FILE=testpilot-dev-Dockerrun.aws.json

# Deploy image to Docker Hub
# TODO: Not used, for now. Just deploy from latest in Dockerrun.
# docker tag app:build ${DOCKERHUB_REPO}:$SHA
# docker push ${DOCKERHUB_REPO}:$SHA

# Generate app bundle from template
sed "s/<TAG>/$SHA1/" < Dockerrun.aws.json-template > $DOCKERRUN_FILE
aws s3 cp $DOCKERRUN_FILE s3://$EB_BUCKET/$DOCKERRUN_FILE

# Create new Elastic Beanstalk version
aws elasticbeanstalk create-application-version \
    --application-name $APP_NAME \
    --version-label $SHA1 \
    --source-bundle S3Bucket=$EB_BUCKET,S3Key=$DOCKERRUN_FILE

# Update Elastic Beanstalk environment to new version
aws elasticbeanstalk update-environment \
    --template-name $CONFIG_TEMPLATE_NAME \
    --environment-name $ENV_NAME \
    --version-label $SHA1
