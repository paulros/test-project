#!/bin/bash
# Exit script if you try to use an uninitialized variable.
set -o nounset

# Exit script if a statement returns a non-true return value.
set -o errexit

# Use the error status of the first failure, rather than that of the last item in a pipeline.
set -o pipefail

# Deploy script/wrapper
#version=${"$(gcloud container images list-tags eu.gcr.io/entur-rtd/circleci-demo --filter="tags:$CIRCLE_BRANCH-v*" --format='get(tags)' --limit 1)"#$CIRCLE_BRANCH-v}
#version=$(gcloud container images list-tags eu.gcr.io/entur-rtd/circleci-demo --filter="tags:$CIRCLE_BRANCH-v*" --format='get(tags)' --limit 1 | grep -o '[0-9]*$')

#echo "Deploying new version: $version"
#helm repo update
#helm fetch --untar entur-rtd-repo/circleci-demo --version=$version
helm upgrade --install circleci-demo-default ./circleci-demo --set environment=default --namespace default --wait