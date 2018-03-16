MarketSpace Reservations
========================

About
-----

MarketSpace Reservations is Node.js code. The project is organized as follows:

    /client - Client side JS, HTML and Less source files. 
              Each sub-folder is an Angular 1 directive. 
              All .js and .less files you add here will be auto-compiled by grunt.
    /public - Client side images, and compiled/minified JS/CSS.  
              Don't add code here unless absolutely necessary
    /server - Server side code based on an ExpressJS app. 
              /server is based around entities. 
              Most folders under /server will be named with the name of an entity. 
              Follow the example entity called "sample" and how the filse are named. 
              To expose an entity through the API you need only include a *ApiController.js class
    /test   - Helper code for tests. Don't put tests here.

Setup
-----

Install NodeJS 4.*  You can use a newer version if you prefer but if you have conflicts, use NVM (Node Version Manager) to downgrade to 4.*  The project must work in NodeJS 4.*

Install global dependencies

    $ npm install -g nodeunit

Install project dependencies

    $ npm install

Run
---

To run the project:

    $ npm start

This runs grunt. We use grunt to run the project and compile client side .js and .less. Grunt is setup to watch for file changes to any of your .js and .less files so you shouldn't need to restart the project very often - grunt will do it for you. Usually the only time you need to restart is if you change the Gruntfile.js.

Tests
-----

Tests are written using nodeunit and should be located in /server alongside the class being tested. See sample.test.js

Run Tests:

    $ npm test

Run a group of tests in a file:

    $ nodeunit path/to/entity.test.js 

Or an individual test:

    $ nodeunit path/to/entity.test.js -f test_name_here

- Tests are named:  methodBeingTested_situationBeingTested_expectedResults
- To turn on logging, uncomment helper.HideLogging(this); and helper.ShowLogging(this); in the setUp, tearDown methods
- You can run individual test files as follows:


    $ nodeunit path/to/entity.test.js 

Or single tests:

    $ nodeunit path/to/entity.test.js -f test_name_here


Coding Standards
----------------

- Create a branch in Git for each chunk of work
- Merge the branch into master when it's finished and delete the branch
- Include a comment when committing changes to repo
- Use Tabs (4 chars) for indents. 
- Use single quotes.
- Use // for comments. Use /* */ for temporarily commenting out code.
- 'use strict'; in all JS files.
- We use ESLint to lint JS files. Lint is run when any JS file changes. Ensure your code passes the Lint.
- Put all client side JS, html, less source under /client
- Put all server side JS, EJS and their related less source under /server
- Use ES2015 "class" where possible. See sampleService.js
- Use Mongoose for MongoDB schemas. See sample.db.schema.js
- Don't modify 
    - /server/api/*
    - /server/middleware/ensure.middleware.js


Notes
-----

- Ensure all NPM libraries are saved to package.json and added to Git
- Please don't run bower install - use the files included in Git. If you need to add new bower dependencies, please do so without overwriting what's there.
