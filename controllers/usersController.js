import orm from "../lib/orm";

export default {
  create: function(req, res) {
    
    const model = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    };
    
    orm
      .models
      .User
      .create(model)
      .then(function(user) {
        return res.sendStatus(201);
      })
      .catch(orm.Sequelize.UniqueConstraintError, function(err) {
        return res.sendStatus(400);
      });
  }
};
