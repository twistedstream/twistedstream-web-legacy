# stop and remove any existing containers
RUNNING_CONTAINERS=$(docker ps -a -q)
if [[ $RUNNING_CONTAINERS ]]; then
  docker stop $RUNNING_CONTAINERS
  docker rm $RUNNING_CONTAINERS
fi

# build image
docker build -t="app" .

# run the container from the image
docker run -d -p 8080:80 app
