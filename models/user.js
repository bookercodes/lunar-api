"use strict";

import bcrypt from "bcryptjs";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    userId: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    hooks: {
      afterValidate: function(user) {
        user.password = bcrypt.hashSync(user.password, 8);
      }
    },
    classMethods: {
      authenticate: function (username, password) {
        return new Promise(function(resolve) {
          User
            .findOne({
              where: {
                username: username
              }
            })
            .then(function (user) {
              if (!user) {
                resolve(false);
              } else {
                const success = bcrypt.compareSync(
                  password,
                  user.dataValues.password);
                resolve(success);
              }
            });
        });
      },
      validateAvailability: function(field, value) {
        return new Promise(function(resolve) {
          User
            .findOne({
              where: {
                [field]: value
              }
            })
            .then(function(user) {
              const errors = [];
              if (user) {
                errors.push({
                  path: field,
                  message: `"${field}" is taken`
                });
              }
              resolve(errors);
            });
        });
      }
    }
  });
  return User;
};
