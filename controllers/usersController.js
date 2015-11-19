import dbContext from "sequelize-context";

export default {
  authenticate(req, res, next) {
    dbContext
      .models
      .User
      .authenticate(req.body.username, req.body.password)
      .then(function(success) {
        if (success) {
          return res
            .status(200)
            .send({
              message: "Authenticated",
            });
        }
        return res
          .status(200)
          .send({
            message: "Invalid credentials",
            errors: [{
              message: "Username or password is incorrect."
            }]
          });
      });
    },

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
