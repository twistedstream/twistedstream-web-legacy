# TwistedStream Web App

The source code for [twistedstream.com](http://www.twistedstream.com).

This web app demonstrates the use of:

* Node v0.11 and [ES6 generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)
* [Koa.js](http://koajs.com/) as the backend
* [Mocha](http://mochajs.org/) as the test runner
* [Twitter Bootstrap](https://github.com/twbs/bootstrap) and [Bower](http://bower.io/) in the frontend
* [Gulp](http://gulpjs.com/) as the build engine
* [Nodemon](https://github.com/remy/nodemon) as the local dev server
* [Docker](https://www.docker.com/) to run the app in a container

## Usage

To run in local development mode:

```bash
# if not running node 0.11
nvm use 0.11

# if you haven't installed dependencies yet
npm install
bower install

# run the dev server
gulp dev
```

The app can then be accessed at: http://localhost:5000/

To execute the app in a local Docker container (running in [boot2docker](http://boot2docker.io/)):

```bash
# if boot2docker is not running
boot2docker start

# if the shell hasn't been initialized
$(boot2docker shellinit)

# build the image, run the container, and launch a browser
sh run-docker.sh
```
