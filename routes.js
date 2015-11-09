const express             = require("express");
const createUserValidator = require("./validators/createUserValidator");

const router = express.Router();

const users = require("./controllers/usersController");
router
  .route("/users")
  .post(createUserValidator.validateBody, users.create);

module.exports = router;
