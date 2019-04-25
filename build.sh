#!/bin/bash
# Build script/wrapper

# Exit script if you try to use an uninitialized variable.
set -o nounset

# Exit script if a statement returns a non-true return value.
set -o errexit

# Use the error status of the first failure, rather than that of the last item in a pipeline.
set -o pipefail

lastImage=$(gcloud container images list-tags eu.gcr.io/fagdag-devops/circleci-demo --filter="tags:$CIRCLE_BRANCH-v*" --format='get(tags)' --limit 1)
version=$(echo $lastImage | grep -o '[0-9]*$')
version=$(($version+1))
echo "new version: $version"
echo "new image tag is $CIRCLE_BRANCH-v$version"
docker build -t eu.gcr.io/fagdag-devops/circleci-demo:$CIRCLE_BRANCH-v$version .
# Login to Docker
docker login -u _json_key -p "$(cat ${HOME}/account-auth.json)" https://eu.gcr.io

# Push image to Google Container Repository
docker push eu.gcr.io/fagdag-devops/circleci-demo:$CIRCLE_BRANCH-v$version

# Update helm versions
sed -i "s/version:.*$/version: '$version'/g"  ./circleci-demo/Chart.yaml
sed -i "s/appVersion:.*$/appVersion: '$CIRCLE_BRANCH-v$version'/g"  ./circleci-demo/Chart.yaml
sed -i "s/imageTag:.*$/imageTag: '$CIRCLE_BRANCH-v$version'/g"  ./circleci-demo/values.yaml
helm package circleci-demo ./circleci-demo
helm gcs push circleci-demo-$version.tgz gs://entur-rtd-helm-charts

# Helm files will be persisted to workspace for deployments.