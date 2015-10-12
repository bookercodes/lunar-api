"use strict";

import bcrypt from "bcryptjs";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    userId: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER 
    },
    username: DataTypes.TEXT,
    password: DataTypes.TEXT
  }, {
    hooks: {
      afterValidate: function(user) {
        user.password = bcrypt.hashSync(user.password, 12);
      }
    }
  });
  return User;
};
