import Promise from "bluebird";
import joi from "joi";
import util from "../lib/util";

const loginValidator = {};

loginValidator.validateBody = function(req, res, next) {
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
        .required()
    };
    const options = {
      abortEarly: false
    };
    joi.validate(req.body, schema, options, function(error) {
      if (error) {
        return resolve(util.extractErrors(error.details));
      }
      resolve([]);
    });
  });
};

export default loginValidator;
