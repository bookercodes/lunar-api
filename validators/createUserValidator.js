import joi from "joi";
import _ from "lodash";
import dbContext from "sequelize-context";
import Promise from "bluebird";

function validateAvailability(property, value) {
  return new Promise(function(resolve) {
    dbContext
      .models
      .User
      .findOne({
        where: {
          [property]: value
        }
      })
      .then(function(user) {
        var errors = [];
        if (user) {
          errors.push({
            path: property,
            message: `"${property}" is taken`
          });
        }
        resolve(errors);
      });
  });
}

const validateUsernameAvailability = username => validateAvailability(
  "username", username);
const validateEmailAvailability = email => validateAvailability("email",
  email);

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
    joi.validate(body, schema, {
      abortEarly: false
    }, function(error) {
      if (error)
        resolve(error.details);
      else
        resolve([]);
    });
  });
}

export default {
  validateBody: function(req, res, next) {

    var promises = [
      validateBody(req.body),
      validateUsernameAvailability(req.body.username),
      validateEmailAvailability(req.body.email)
    ];

    Promise.reduce(promises, (errorsAggregate, errors) => errorsAggregate.concat(
      errors), []).then(function(errors) {
      errors = _
        .uniq(errors, detail => detail.path)
        .map(detail => detail.message);
      if (errors.length > 0) {
        return res.status(400).json(errors);
      }
      return next();
    });
  }
};
