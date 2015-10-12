"use strict";

module.exports = function(sequelize, DataTypes) {
  console.log('i am groot');
  var User = sequelize.define("User", {
    userId: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER 
    },
    username: DataTypes.TEXT,
    password: DataTypes.TEXT
  });
  return User;
};
