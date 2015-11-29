import dbContext from "sequelize-context";

export default {
  sendTasksForUser(req, res) {
    dbContext
      .models
      .User
      .findOne({
        where: {
          userId: req.params.uid
        }
      })
      .then(function(user) {
        if (user) {
          res.sendStatus(403);
        } else {
          res.sendStatus(404);
        }
      });
  }
};

