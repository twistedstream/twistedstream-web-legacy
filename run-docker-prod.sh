# build image
docker build -t="app" .

# stop and remove any existing containers
RUNNING_CONTAINERS=$(docker ps -a -q)
if [[ $RUNNING_CONTAINERS ]]; then
  docker stop $RUNNING_CONTAINERS
  docker rm $RUNNING_CONTAINERS
fi

# run the container from the new image
docker run -d -p 80:8080 -e "JWT_SECRET=$JWT_SECRET" app
