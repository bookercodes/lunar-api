import dbContext from "sequelize-context";

export default {
  create(req, res, next) {

    const model = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    };

    dbContext
      .models
      .User
      .create(model)
      .then(function(user) {
        res.status(201).json({
          message: "User created."
        });
      })
      .catch(function(err) {
        next(err);
      });
  },
};
