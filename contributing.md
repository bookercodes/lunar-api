# Lunar


## Developer's Guide

This is a **rough** set of somewhat-**naïve** guidelines. You should feel free to update this.

- Remember the [Golden Rule](https://en.wikipedia.org/wiki/Golden_Rule) of test-driven development: [*"Never write new functionality without a failing test"*](http://www.amazon.co.uk/Growing-Object-Oriented-Software-Guided-Signature/dp/0321503627).  
- Remember to use the _`--save`_ flag when installing dependencies via [_`npm install`_](https://docs.npmjs.com/cli/install).
- Use double quotes (*"*) **not** single quotes (*'*).


## Structure

Here is what I am thinking for project structure:

**_`/models`_**

The _`/models`_ directory is for [Sequelize](http://docs.sequelizejs.com/en/latest/) models **only**. These models correlate to tables in the database. They should **not** contain business logic.

**_`/controllers`_**

Do not let the directory name fool you, this is **not** [model-view-controller](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller).  This directory should contain route handlers. I called it _"controllers"_ because that is a common thing to do in Node.

**_`/lib`_**

This directory contains "utility" code. Anything you might be tempted to put in here belongs in a separate module and GitHub repository.  It only exists to accomodate [`83a29f4`](https://gitlab.com/booker/Lunar/commit/83a29f434fdf85d89107448d9e21c4cba038cb5c) and will be deleted soon.

**_`/tests`_**

The _`/tests`_ directory is for unit **and** integration tests. It would be a good idea to seperate unit and integration tests.

## Files

**_`index.js`_**

This file is a shim for [Babel](https://babeljs.io/). It exists so we can use ES6 and that is all

**_`routes.js`_**

Use this file to define routes **only**. Business logic should be deferred to controllers.


**_`server.js`_**

Use this file to mount Express middleware. Also use this file to initialize the application.

