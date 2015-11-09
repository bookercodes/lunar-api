import express from 'express';
import createUserValidator from "./validators/createUserValidator";

const router = express.Router();

import users from "./controllers/usersController";
router
  .route("/users")
  .post(createUserValidator.validateBody, users.create);

export default router;
