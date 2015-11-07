import _ from "lodash";
import joi from "joi";
import Promise from "bluebird";
import db from "sequelize-context";
import {
  extractErrors
}
from "../lib/util.js";

const createUserValidator = {};

function validateUsernameAvailability(username) {
  return db.models.User.validateAvailability("username", username);
}

function validateEmailAvailability(email) {
  return db.models.User.validateAvailability("email", email);
}

function validateBody(body) {
  return new Promise(function(resolve) {
    const schema = {
      username: joi
        .string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
      password: joi
        .string()
        .min(6)
        .max(100)
        .required(),
      email: joi
        .string()
        .email()
        .required()
    };
    const options = {
      abortEarly: false
    };
    joi.validate(body, schema, options, function(error) {
      if (error) {
        return resolve(error.details);
      }
      resolve([]);
    });
  });
}

createUserValidator.validateBody = function(req, res, next) {

  const tasks = [
    validateBody(req.body),
    validateUsernameAvailability(req.body.username),
    validateEmailAvailability(req.body.email)
  ];

  Promise
    .reduce(tasks, (errorsAggregate, errors) => errorsAggregate.concat(
      errors), [])
    .then(function(errors) {
      errors = extractErrors(errors);
      if (errors.length > 0) {
        return res.status(400).json({
          errors: errors
        });
      }
      next();
    });

};

export default createUserValidator;
