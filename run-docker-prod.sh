#!/bin/sh
set -e

# usage:
# sh run-docker-prod.sh JWT_SECRET SANDBOX_TIMEOUT

# build image
docker build -t="app" --force-rm .

# stop and remove any existing containers
RUNNING_CONTAINERS=$(docker ps -a -q)
if [[ $RUNNING_CONTAINERS ]]; then
  docker stop $RUNNING_CONTAINERS
  docker rm $RUNNING_CONTAINERS
fi

# run the container from the new image with the passed config data
docker run -d -p 80:8080 -e "JWT_SECRET=$1" -e "SANDBOX_TIMEOUT=$2" -e "GOOGLE_DOCS_RESUME_BASE_EXPORT_URL=$3" app
