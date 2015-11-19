import express from 'express';
import createUserValidator from "./validators/createUserValidator";
import loginValidator from "./validators/loginValidator";

const router = express.Router();

import users from "./controllers/usersController";
router
  .route("/login")
  .post(function (req,res,next) {
    loginValidator
      .validateBody(req, res)
      .then(function(errors) {
        if (errors.length >= 1) {
          res.status(400).json({
            message: "Validation failed",
            errors: errors
          });
        } else {
          next();
        }
      });
  }, users.authenticate);
router
  .route("/users")
  .post(function(req, res, next) {
    createUserValidator
      .validateBody(req, res)
      .then(function(errors) {
        if (errors.length >= 1) {
          res.status(400).json({
            message: "Validation failed",
            errors: errors
          });
        } else {
          next();
        }
      });
  }, users.create);

export default router;
