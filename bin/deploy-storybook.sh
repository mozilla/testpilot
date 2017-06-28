#!/bin/bash

STORYBOOK_BUCKET=${STORYBOOK_BUCKET:-storybook.testpilot.dev.mozaws.net}
if [ -z "$STORYBOOK_BUCKET" ]; then
  echo "The S3 bucket is not set. Failing."
  exit 1;
fi

# Skip builds for Pontoon commits
IS_PONTOON=$(git show -s --format=%s | grep -q 'Pontoon:' && echo 'true' || echo '')
if [[ $IS_PONTOON ]]; then
  echo "Skipping Storybook deploy on Pontoon commit.";
  exit 0;
fi

# HACK: Build static storybook with URL paths edited to include git hash
HASH=$(git --no-pager log --format=format:"%H" -1)
cp -r .storybook .storybook-$HASH
sed -i "s#href=\"/static#href=\"/$HASH/static#g" .storybook-$HASH/preview-head.html
./node_modules/.bin/build-storybook -c .storybook-$HASH -o ./frontend/storybook/$HASH
rm -rf .storybook-$HASH
cp -r ./frontend/build/static ./frontend/storybook/$HASH

# Deploy the files to bucket with git hash subdirectory
aws s3 cp \
  --recursive \
  --acl "public-read" \
  ./frontend/storybook/${HASH} s3://${STORYBOOK_BUCKET}/${HASH}/

STORYBOOK_URL="http://$STORYBOOK_BUCKET/$HASH/"
echo "Deployed Storybook to $STORYBOOK_URL"

# Deploy a client-side redirect page for a per-PR URL
if [[ ! -z $CI_PULL_REQUEST ]]; then
  STORYBOOK_PR_PATH=$(echo $CI_PULL_REQUEST | cut -d/ -f6-7);
  STORYBOOK_PR_URL=http://${STORYBOOK_BUCKET}/${STORYBOOK_PR_PATH}/index.html
  REDIRECT_HTML=$(cat <<EOF
<!DOCTYPE html>
<html>
  <head>
    <title>Storybook for ${STORYBOOK_PR_PATH}</title>
    <meta http-equiv="refresh" content="0;URL='${STORYBOOK_URL}'" />
  </head>
  <body>
    <p><a href="${STORYBOOK_PR_URL}">${STORYBOOK_URL}</a></p>
  </body>
</html>
EOF
)
  echo $REDIRECT_HTML | \
    aws s3 cp --content-type "text/html" --acl "public-read" - \
      s3://${STORYBOOK_BUCKET}/${STORYBOOK_PR_PATH}/index.html

  echo "Deployed Storybook PR redirect to ${STORYBOOK_PR_URL}"
fi
