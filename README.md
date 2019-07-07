# TwistedStream Web App

The source code for [twistedstream.com](http://www.twistedstream.com).

This web app demonstrates the use of:

* [Koa.js](http://koajs.com/) on [io.js](https://iojs.org/) in the backend
* [jQuery](http://jquery.com/), [Twitter Bootstrap](https://github.com/twbs/bootstrap), and [Bower](http://bower.io/) in the frontend
* [ES6 generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)
* [ES6 Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
* [Mocha](http://mochajs.org/) as the test runner
* [Gulp](http://gulpjs.com/) as the build engine
* [Nodemon](https://github.com/remy/nodemon) as the local dev server

## Usage

To run in local development mode:

```bash
# if not running iojs v1
nvm use iojs-v1

# if you haven't installed dependencies yet
npm install
bower install

# if you haven't created a .env file yet
echo JWT_SECRET="I am a fake mountain." >> .env
echo SANDBOX_TIMEOUT=1000 >> .env
echo GOOGLE_DOCS_RESUME_BASE_EXPORT_URL="http://resume.url/?id=foo" >> .env
echo STACK_OVERFLOW_CAREERS_URL="http://stack.overflow.careers.url" >> .env

# run the dev server
gulp dev
```

The app can then be accessed at: [http://localhost:5000/](http://localhost:5000/)
