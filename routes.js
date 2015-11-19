import express from 'express';
import createUserValidator from "./validators/createUserValidator";

const router = express.Router();

import users from "./controllers/usersController";
router
  .route("/login")
  .post(function (req,res,next) {
    res.sendStatus(400);
  });
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
