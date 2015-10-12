// source https://github.com/jspizziri/sequelize-singleton

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var db = {};
var log = function(log) {
  if (typeof db.logger === 'function')
    db.logger(log);
};


// Recurse through the specified directory structure
var dive = function(dir, action, matcher) {
  // Assert that it's a function
  if (typeof action !== "function")
    action = function(error, file) {};

  // Read the directory
  fs.readdirSync(dir).forEach(function(file) {
    var path = dir + "/" + file; // Full path of that file
    var stat = fs.statSync(path); // Get the file's stats

    // If the file is a directory
    if (stat && stat.isDirectory())
      dive(path, action); // Dive into the directory
    else {
      // Allow user to define a custom matcher function
      if (typeof matcher === 'function' && matcher(file) === true)
        action(null, path); // Call the action
      else if ((file.indexOf(".") !== 0) && (file.indexOf(".model.js") > 0))
        action(null, path); // Call the action
    }
  });
};
db.Sequelize = Sequelize; // Expose Sequelize
db.models = {}; // Expose models

db.discover = ["/model"]; // Set the default discovery paths
db.matcher = null; // Set matcher to null

// Define default logger function
db.logger = function(log) {
  console.log(log);
};

// Expose the connection function
db.connect = function(database, username, password, options) {

  log("Connecting to: " + database + " as: " + username);

  // Instantiate a new sequelize instance
  var sequelize = new db.Sequelize(database, username, password, options);


  db.discover.forEach(function(location) {

    // Recurse through the api directory and collect the models
    dive(location, function(err, path) {

      log("Loading Model: " + path.substring(path.lastIndexOf("/") + 1));

      var model = sequelize["import"](path);

      if (model)
        db.models[model.name] = model;
    }, db.matcher);
  });

  // Execute the associate methods for each Model
  Object.keys(db.models).forEach(function(modelName) {

    if ("associate" in db.models[modelName]) {

      log("Associating Model: " + modelName);

      db.models[modelName].associate(db.models);
    } else {
      log("Nothing to associate for Model: " + modelName);
    }
  });


  // Expose the sequelize object
  db.sequelize = sequelize;

  log("Finished Connecting");

  return true;
};

module.exports = db;
