'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn("Users", "createdAt", {
      type: Sequelize.DATE
    });
    queryInterface.addColumn("Users", "updatedAt", {
      type: Sequelize.DATE
    });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removColumn("Users", "createdAt");
    queryInterface.removeColumnn("Users", "updatedAt");
  }
};
