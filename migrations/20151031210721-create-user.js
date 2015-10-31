'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable("Users", {
      userId: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER 
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable("Users");
  }
};
