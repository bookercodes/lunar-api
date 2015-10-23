import express from 'express';

const router = express.Router();

import users from "./controllers/usersController";
router
  .route("/users")
  .post(users.create);

export default router;
