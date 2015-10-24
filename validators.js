import validator from "express-joi-validator";
import joi from "joi";

export default {
  joinBody: validator({
    body: {
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
    }
  })
};
