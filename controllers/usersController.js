import dbContext from "sequelize-context";

export default {
  create(req, res) {
    
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
        res.sendStatus(201);
      })
      .catch(dbContext.Sequelize.UniqueConstraintError, function(err) {
        res.sendStatus(400);
      });
  }
};
