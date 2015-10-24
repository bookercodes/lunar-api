import express from 'express';
import validate from "./validators";

const router = express.Router();

import users from "./controllers/usersController";
router
  .route("/users")
  .post(validate.joinBody, users.create);

export default router;
