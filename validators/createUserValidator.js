import _ from "lodash";
import joi from "joi";
import Promise from "bluebird";
import db from "sequelize-context";

function validateAvailability(field, value) {
  return new Promise(function(resolve) {
    db
      .models
      .User
      .findOne({
        where: {
          [field]: value
        }
      })
      .then(function(user) {
        const errors = [];
        if (user) {
          errors.push({
            path: field,
            message: `"${field}" is taken`
          });
        }
        resolve(errors);
      });
  });
}

function validateUsernameAvailability(username) {
  return validateAvailability("username", username);
}

function validateEmailAvailability(email) {
  return validateAvailability("email", email);
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

function extractErrors(errors) {
  return _
    .uniq(errors, detail => detail.path)
    .map(detail => detail.message);
}

export default {
  validateBody: function(req, res, next) {

    const promises = [
      validateBody(req.body),
      validateUsernameAvailability(req.body.username),
      validateEmailAvailability(req.body.email)
    ];

    Promise
      .reduce(promises, (errorsAggregate, errors) => errorsAggregate.concat(errors), [])
      .then(function(errors) {
        errors = extractErrors(errors);
        if (errors.length > 0) {
          return res.status(400).json(errors);
        }
        next();
      });
  }
};
