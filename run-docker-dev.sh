# NOTE: This shell script runs on a Mac with boot2docker installed and running

# build the image
docker build -t="app" .

# run the container from the image
CONT_ID=$(docker run -d -p 8080 -e "JWT_SECRET=$JWT_SECRET" app)

# get the boot2docker IP and port and launch a browser
VM_IP=$(boot2docker ip)
PORT=$(docker port $CONT_ID 8080 | awk -F: '{print $2}')
URL="http://$VM_IP:$PORT"
echo "Web app is running at: $URL"
open "http://$VM_IP:$PORT/"
