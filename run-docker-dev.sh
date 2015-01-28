#!/bin/sh
set -e

# usage:
# sh run-docker-dev.sh JWT_SECRET SANDBOX_TIMEOUT

# build the image
docker build -t="app" --force-rm .

# run the container from the image with the passed config data
CONT_ID=$(docker run -d -p 8080 -e "JWT_SECRET=$1" -e "SANDBOX_TIMEOUT=$2" -e "GOOGLE_DOCS_RESUME_BASE_EXPORT_URL=$3" app)

# get the boot2docker IP and port and launch a browser
VM_IP=$(boot2docker ip)
PORT=$(docker port $CONT_ID 8080 | awk -F: '{print $2}')
URL="http://$VM_IP:$PORT"
echo "Web app is running at: $URL"
open "http://$VM_IP:$PORT/"
