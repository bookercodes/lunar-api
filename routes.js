import express from 'express';
import createUserValidator from "./validators/createUserValidator";

const router = express.Router();

import users from "./controllers/usersController";
router
  .route("/users")
  .post(function(req, res, next) {
    createUserValidator
      .validateBody(req, res)
      .then(function(errors) {
        if (errors) {
          res.status(400).json(errors);
        } else {
          next();
        }
      });
  }, users.create);

export default router;
